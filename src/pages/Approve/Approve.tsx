import { useEffect, useState } from 'react';
import { useAccount, useBalance, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import contractABI from '../../abi/myTokenAbi.json';
import { Abi } from 'viem';
import { simulateContract } from '@wagmi/core'
import { config } from '@/main';
import { usePublicClient } from 'wagmi';
import { ethers, toBigInt } from 'ethers';
import { contractAddress } from '@/config/config';
export interface Tweet {
    id: bigint;
    author: string;
    content: string;
    timestamp: bigint;
    likes: bigint;
}

const Approve = () => {
    const publicClient = usePublicClient({
        config
    });
    const { address, isConnected } = useAccount();
    const {data: balance} = useBalance({
        address
    })
    const [toAddress, setToAddress] = useState('');
    const [amount, setAmount] = useState('');
    const {  writeContractAsync, data: txHash } = useWriteContract();
    const {isFetched } = useWaitForTransactionReceipt({
        hash: txHash,
    });
    
    
    const handleCreateTweet = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (toAddress !== '' && amount !== '') {
            const valueAmount = ethers.parseUnits(amount, 18);
           try {
            const gasPrice = (await publicClient?.getGasPrice()) as bigint;
            const { request } = await simulateContract(config, {
                address: contractAddress.MyTokenAddress,
                abi: contractABI as Abi,
                functionName: 'approve',
                args: [toAddress, valueAmount],
            })
            const estimatedGas = (await publicClient?.estimateContractGas({
                address: contractAddress.MyTokenAddress,
                abi: contractABI as Abi,
                functionName: 'approve',
                args: [toAddress, valueAmount],
                account: address
            })) as bigint;
            const gasCost = estimatedGas * gasPrice;
            const num1 = toBigInt(balance?.value || '0');
            const num2 = toBigInt(gasCost);
            if (num1 <= num2) {
                alert('You don\'t have enough ETH to create tweet');
                return;
            }
            await writeContractAsync(request);
           } catch (error) {
            console.log({error});
           }
        } else {
            alert('Vui lòng nhập content');
        }
    };

    return (
        <div>
            {isConnected && (
                <div>
                    <div className="mt-4">Connected: {address}</div>
                    <br />
                    <form onSubmit={handleCreateTweet}>
                        <input
                            value={toAddress}
                            onChange={(e) => setToAddress(e.target.value)}
                            className="block w-full border border-gray-400 p-2 outline-none rounded-sm"
                            placeholder="What's happening?"
                        ></input>
                        <br />
                        <input
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="block w-full border border-gray-400 p-2 outline-none rounded-sm"
                            placeholder="What's happening?"
                        ></input>
                        <br />
                        <button id="tweetSubmitBtn" type="submit" className="p-2 bg-blue-400 rounded-3xl text-black">
                            Create Tweet
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Approve;
