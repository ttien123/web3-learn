import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import contractABI from "../../abi/abi.json";
import Loading from "../../components/Loading/Loading";
import { Abi } from "viem";
import type { Config } from 'wagmi';

export interface Tweet {
    id: bigint;
    author: string;
    content: string;
    timestamp: bigint;
    likes: bigint;
}

const TweetPage = () => {
  const { address, isConnected } = useAccount();
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS
  const [tweet, setTweet] = useState("");
  const [listTweet, setListTweet] = useState<Tweet[]>([]);
  const queryClient = useQueryClient();
  const { writeContract, isPending, data:txHash } = useWriteContract()
  const { isFetching, isFetched } = useWaitForTransactionReceipt({
    hash: txHash,
  })
  const { data: listTweetData, isLoading: isLoadingListTweet, queryKey } = useReadContract<Abi, string, Array<any>, Config, Tweet[]>({
    abi: contractABI as Abi,
    address: contractAddress,
    functionName: 'getAllTweets',
    args: [address]
  })

  const handleCreateTweet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (tweet !== '') {
      writeContract({
        address: contractAddress,
        abi: contractABI as Abi,
        functionName: "createTweet",
        args: [tweet],
      })
    } else {
      alert("Vui lòng nhập content");
    }
  }

  const handleLikeTweet = (author: string, id: bigint) => {
    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: "likeTweet",
      args: [author, id],
    })
  }

  useEffect(() => {
    listTweetData && setListTweet(listTweetData);
  }, [listTweetData]);

  useEffect(() => {
    isFetched && queryClient.invalidateQueries({ queryKey });
    setTweet('')
  }, [isFetched]);

  return (
    <div >
      {isConnected && (
          <div>
            <div className='mt-4'>Connected: {address}</div>
            <br />
            <form onSubmit={handleCreateTweet}>
              <textarea
                value={tweet}
                onChange={e => setTweet(e.target.value)}
                className='block w-full border border-gray-400 p-2 outline-none rounded-sm'
                rows={4}
                placeholder="What's happening?"
              ></textarea>
              <br />
              <button id="tweetSubmitBtn" type="submit" className='p-2 bg-blue-400 rounded-3xl text-black'>Create Tweet</button>
            </form>
            <br />
            <div>
              {listTweet.map((tweets) => {
                return (
                  <div key={tweets.id} className='p-2 my-2 bg-gray-300 rounded-sm'>
                    <div>{tweets.author}</div>
                    <div>content: {tweets.content}</div>
                    <div>
                      <button onClick={() => handleLikeTweet(tweets.author, tweets.id)} className='mr-2'>Like</button>
                      <span>{tweets.likes}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>)}
      <Loading isLoading={isPending || isFetching || isLoadingListTweet}/>
    </div>
  );
}

export default TweetPage;
