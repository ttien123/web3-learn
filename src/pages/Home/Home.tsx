import { useAccount, useBalance, useReadContract } from 'wagmi';
import contractMyTokenABI from '../../abi/myTokenAbi.json';
import { useEffect } from 'react';
import { handleConvertToToken } from '../../utils/convertNumber';
import useStateSignContract from '@/store/loadingSignContract';
import ModalApp from '@/components/ModalApp/ModalApp';
import MintForm from './components/MintForm/MintForm';

// const adminAdress = "0x7d4852e8aB93E0d983eA33a9d5cc7B3eC762A088"
const contractAddress = import.meta.env.VITE_CONTRACT_MYTOKEN_ADDRESS;
const Home = () => {
    const { setIsLoadingSignContract } = useStateSignContract();

    const { address, isConnected } = useAccount();
    const { data: totalETH, isLoading: isLoadingETH } = useBalance({
        address,
    });

    const { data: balanceToken, isLoading: isGetBalance } = useReadContract({
        abi: contractMyTokenABI,
        address: contractAddress,
        functionName: 'balanceOf',
        args: [address],
        query: {
            enabled: isConnected,
        },
    });

    useEffect(() => {
        setIsLoadingSignContract(isLoadingETH || isGetBalance);
    }, [isLoadingETH, isGetBalance, setIsLoadingSignContract]);

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
                <ModalApp renderPopover={<MintForm />}>
                    <button
                        // onClick={mintFreeTokens}
                        className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-12 py-2 sm:w-auto"
                        // disabled={isMintLoading}
                    >
                        Mint Tokens
                    </button>
                </ModalApp>

                {/* {txSuccess && <p>Success</p>} */}
            </div>

            <div className="flex flex-col mb-8">
                <button
                    // onClick={buySomeTokens}
                    className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-12 py-2 sm:w-auto"
                >
                    Buy Tokens
                </button>
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
                <h3 className="text-lg ">Total minted</h3>

                {/* <h3 className="text-lg">{supplyData}</h3> */}
            </div>
        </div>
    );
};

export default Home;
