import { useAccount, useBalance, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import contractMyTokenABI from '../../abi/myTokenAbi.json';
import { useEffect } from 'react';
import { handleConvertToToken } from '../../utils/convertNumber';
import useStateSignContract from '@/store/loadingSignContract';
import ModalApp from '@/components/ModalApp/ModalApp';
import MintForm from './components/MintForm/MintForm';
import BuyTokenForm from './components/BuyTokenForm/BuyTokenForm';
import { useQueryClient } from '@tanstack/react-query';
import { simulateContract } from '@wagmi/core'
import { config } from '@/main';

// const adminAdress = "0x7d4852e8aB93E0d983eA33a9d5cc7B3eC762A088"
const contractAddress = import.meta.env.VITE_CONTRACT_MYTOKEN_ADDRESS;
const Home = () => {
    const queryClient = useQueryClient();

    const { setIsLoadingSignContract } = useStateSignContract();
    const { address, isConnected } = useAccount();
    const { data: totalETH, isLoading: isLoadingETH, queryKey: queryKeyETH } = useBalance({
        address,
        query: {
            enabled: isConnected,
        }
    });

    const { data: balanceToken, isLoading: isGetBalance, queryKey: queryKeyToken } = useReadContract({
        abi: contractMyTokenABI,
        address: contractAddress,
        functionName: 'balanceOf',
        args: [address],
        query: {
            enabled: isConnected,
        },
    });
    
    const { writeContractAsync, isPending, data: txHash } = useWriteContract();
    const { isFetching, status: statusWaitTx } = useWaitForTransactionReceipt({
            hash: txHash,
        });

    const handleWithdraw = async () => {
        try {
            const {request} = await simulateContract(config, {
                address: contractAddress,
                abi: contractMyTokenABI,
                functionName: 'withdraw',
                args: []
            })
            writeContractAsync(request);
        } catch (error: any) {
            console.log({error});
            
        }
    }

    useEffect(() => {
        setIsLoadingSignContract(isLoadingETH || isGetBalance || isFetching);
    }, [isLoadingETH, isGetBalance, setIsLoadingSignContract, isFetching]);

    useEffect(() => {
            if (statusWaitTx === 'success') {
                queryClient.invalidateQueries({ queryKey: queryKeyETH });
            }
        }, [statusWaitTx]);

    return (
        <div className="container flex flex-col justify-center mx-auto items-center mt-8">
            <h3 className="text-5xl font-bold mb-8">{'Tien design token drop'}</h3>
            {isConnected && (
                <div>
                    <div className="mb-4 text-3xl">
                        Total Your ETH: {totalETH?.formatted ? Number(totalETH?.formatted).toFixed(4) : 0}{' '}
                        {totalETH?.symbol}
                    </div>
                    <div className="mb-8 text-3xl">
                        Total Your Token: {balanceToken ? handleConvertToToken(balanceToken as string) : 0} UTK
                    </div>
                </div>
            )}
            <div className="flex flex-col mb-8">
                <ModalApp renderPopover={isConnected ? 
                    <MintForm queryKeyETH={queryKeyETH} queryKeyToken={queryKeyToken} /> : 
                     <div className="flex items-center justify-center gap-4 flex-col">
                        <div className="text-black text-center font-medium">Please connect wallet</div>
                    </div>}>
                    <button
                        className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-12 py-2 sm:w-auto"
                        // disabled={isMintLoading}
                    >
                        Mint Tokens
                    </button>
                </ModalApp>
            </div>

            <div className="flex flex-col mb-8">
                <ModalApp renderPopover={isConnected ? 
                    <BuyTokenForm queryKeyETH={queryKeyETH} queryKeyToken={queryKeyToken} /> : 
                    <div className="flex items-center justify-center gap-4 flex-col">
                        <div className="text-black text-center font-medium">Please connect wallet</div>
                    </div>}>
                    <button
                        className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-12 py-2 sm:w-auto"
                    >
                        Buy Tokens
                    </button>
                </ModalApp>
                
            </div>

            <div className="flex flex-col mb-4">
                <button
                    // onClick={claimFaucet}
                    className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-12 py-2 sm:w-auto"
                >
                    Claim Faucet
                </button>
            </div>

            <div className="text-center">
                <button onClick={handleWithdraw} className="text-lg bg-gray-900 text-white hover:bg-gray-800 rounded-full px-12 py-2 sm:w-auto">Withdraw</button>

                {/* <h3 className="text-lg">{supplyData}</h3> */}
            </div>
        </div>
    );
};

export default Home;
