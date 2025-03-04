import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useAccount, useBalance, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import contractABI from '../../abi/abi.json';
import Loading from '../../components/Loading/Loading';
import { Abi } from 'viem';
import type { Config } from 'wagmi';
import { simulateContract } from '@wagmi/core'
import { config } from '@/main';
import { usePublicClient } from 'wagmi';
import { ethers, toBigInt } from 'ethers';
export interface Tweet {
    id: bigint;
    author: string;
    content: string;
    timestamp: bigint;
    likes: bigint;
}

const TweetPage = () => {
    const publicClient = usePublicClient({
        config
    });

    
    const { address, isConnected } = useAccount();
    
    const {data: balance} = useBalance({
        address
    })
    console.log('balance', balance);
    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
    const [tweet, setTweet] = useState('');
    const [listTweet, setListTweet] = useState<Tweet[]>([]);
    const queryClient = useQueryClient();
    const { writeContract, writeContractAsync, data: txHash } = useWriteContract();
    const {isFetched } = useWaitForTransactionReceipt({
        hash: txHash,
    });
    const {
        data: listTweetData,
        isLoading: isLoadingListTweet,
        queryKey,
    } = useReadContract<Abi, string, Array<any>, Config, Tweet[]>({
        abi: contractABI as Abi,
        address: contractAddress,
        functionName: 'getAllTweets',
        args: [address],
    });
    
    
    const handleCreateTweet = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (tweet !== '') {
           try {
            const gasPrice = (await publicClient?.getGasPrice()) as bigint;
            const estimatedGas = (await publicClient?.estimateContractGas({
                address: contractAddress,
                abi: contractABI as Abi,
                functionName: 'createTweet',
                args: [tweet],
            })) as bigint;
            const gasCost = estimatedGas * gasPrice;

            const num1 = toBigInt(balance?.value || '0');
            const num2 = toBigInt(gasCost);
            console.log('num1', num1, 'num2', num2);
            

            if (num1 < num2) {
                alert('You don\'t have enough ETH to create tweet');
                return;
            }
            const { request, result } = await simulateContract(config, {
                address: contractAddress,
                abi: contractABI as Abi,
                functionName: 'createTweet',
                args: [tweet],
            })

            console.log('simulateContract', result);
            
            await writeContractAsync(request);
           } catch (error) {
            console.log({error});
           }
        } else {
            alert('Vui lòng nhập content');
        }
    };

    const handleLikeTweet = (author: string, id: bigint) => {
        writeContract({
            address: contractAddress,
            abi: contractABI,
            functionName: 'likeTweet',
            args: [author, id],
        });
    };

    useEffect(() => {
        if (listTweetData) {
            setListTweet(listTweetData);
        }
    }, [listTweetData]);

    useEffect(() => {
        if (isFetched) {
            queryClient.invalidateQueries({ queryKey });
        }
        setTweet('');
    }, [isFetched]);

    return (
        <div>
            {isConnected && (
                <div>
                    <div className="mt-4">Connected: {address}</div>
                    <br />
                    <form onSubmit={handleCreateTweet}>
                        <textarea
                            value={tweet}
                            onChange={(e) => setTweet(e.target.value)}
                            className="block w-full border border-gray-400 p-2 outline-none rounded-sm"
                            rows={4}
                            placeholder="What's happening?"
                        ></textarea>
                        <br />
                        <button id="tweetSubmitBtn" type="submit" className="p-2 bg-blue-400 rounded-3xl text-black">
                            Create Tweet
                        </button>
                    </form>
                    <br />
                    <div>
                        {listTweet.map((tweets) => {
                            return (
                                <div key={tweets.id} className="p-2 my-2 bg-gray-300 rounded-sm">
                                    <div>{tweets.author}</div>
                                    <div>content: {tweets.content}</div>
                                    <div>
                                        <button
                                            onClick={() => handleLikeTweet(tweets.author, tweets.id)}
                                            className="mr-2"
                                        >
                                            Like
                                        </button>
                                        <span>{tweets.likes}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TweetPage;
