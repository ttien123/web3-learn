import { ConnectButton } from '@rainbow-me/rainbowkit';
import {  useState } from 'react';
import contractABI from "./abi/abi.json";

import {
  type BaseError,
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import Loading from './components/Loading/Loading';

export interface Tweet {
  id: bigint;
  author: string;
  content: string;
  timestamp: bigint;
  likes: bigint;
}


// export const getContract = async (): Promise<Contract> => {
//   if (!window.ethereum) throw new Error("Metamask chưa được cài đặt");
//   const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS
  
//   const provider = new ethers.BrowserProvider(window.ethereum);
//   const signer = await provider.getSigner();
//   return new ethers.Contract(contractAddress, contractABI, signer);
// };

// function App() {
//   const { address } = useAccount();
//   const [tweet, setTweet] = useState("");
//   const [listTweet, setListTweet] = useState<Tweet[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
  
//   const handleCreateTweet = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     if (tweet !== '') {
//       setIsLoading(true);
//       try {
//         const contract = await getContract();
//         const tx = await contract.createTweet(tweet);
//         console.log('tx', tx);
//         await tx.wait();
//         await fetchTweets()
//         setIsLoading(false)
//         alert("Tweet đã được tạo!");
//       } catch (error) {
//         console.log(error);
//         setIsLoading(false);
//       }
//     } else {
//       alert("Vui lòng nhập content");
//     }
//   }

//   const handleLikeTweet = async (author:string, id: bigint) => {
//     setIsLoading(true);
//     try {
//       const contract = await getContract();
//       const tx = await contract.likeTweet(author, id);
//       await tx.wait();
//       await fetchTweets()
//       setIsLoading(false)
//       alert("Like thành công");
//     } catch (error) {
//       console.error("Error liking tweet:", error);
//       setIsLoading(false)
//     }
//   }

//   const fetchTweets = async () => {
//     try {
//       const contract = await getContract();
//       const tempTweets = await contract.getAllTweets(address);
//       const tweets = [...tempTweets];
//       const newList = tweets.map((t: any) => {
//         return ({
//           id: BigInt(t.id),
//           author: t.author,
//           content: t.content,
//           timestamp: BigInt(t.timestamp),
//           likes: BigInt(t.likes),
//         })
//       });
//       setListTweet(newList);

//     } catch (error) {
//       console.error("Lỗi khi lấy tweets:", error);
//     }
//   };

//   useEffect(() => {
//     address && fetchTweets();
//   }, [address]);
  
//   return (
//     <div className="h-screen bg-black text-white p-4">
//       <div className={`bg-white overflow-auto h-full text-black p-4 rounded min-w-[1200px] min-h-[200px] flex items-center flex-col ${!address && 'justify-center '}`}>
//         <div>
//           <ConnectButton  showBalance={false}/>
//         </div>
//         {address && (
//           <div>
//             <div className='mt-4'>Connected: {address}</div>
//             <form onSubmit={handleCreateTweet}>
//               <textarea
//                 value={tweet}
//                 onChange={e => setTweet(e.target.value)}
//                 className='block w-full border border-gray-400 p-2 outline-none rounded-sm'
//                 rows={4}
//                 placeholder="What's happening?"
//               ></textarea>
//               <br />
//               <button id="tweetSubmitBtn" type="submit" className='p-2 bg-blue-400 rounded-3xl text-black'>Create Tweet</button>
//             </form>
//             <br />
//             <div>
//             {listTweet.map((tweets) => {
//               return (
//                 <div key={tweets.id} className='p-2 my-2 bg-gray-300 rounded-sm'>
//                   <div>{tweets.author}</div>
//                   <div>content: {tweets.content}</div>
//                   <div>
//                     <button onClick={() => handleLikeTweet(tweets.author, tweets.id)} className='mr-2'>Like</button>
//                     <span>{tweets.likes}</span>
//                   </div>
//                 </div>
//               )
//             })}
//             </div>
//           </div>)}
//       </div>
//       <Loading isLoading={isLoading}/>
//     </div>
//   )
// }

// export default App

const App = () => {
  const abi = contractABI as const
  const { address, isConnected } = useAccount();
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS
  const { writeContract, isPending, data:txHash } = useWriteContract()
  const { isFetching } = useWaitForTransactionReceipt({
    hash: txHash,
  })
  const { data: listTweet, isLoading:isLoadingListTweet } = useReadContract({
    address: contractAddress,
    abi: abi,
    functionName: 'getAllTweets',
    args: [address]
  })

  
  const [tweet, setTweet] = useState("");
  

  const handleCreateTweet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (tweet !== '') {
      writeContract({
        address: contractAddress,
        abi: abi,
        functionName: "",
        args: [tweet],
      })
    } else {
      alert("Vui lòng nhập content");
    }
  }

  return (
    <div className="h-screen bg-black text-white p-4">
      <div className={`bg-white overflow-auto h-full text-black p-4 rounded min-w-[1200px] min-h-[200px] flex items-center flex-col ${!address && 'justify-center '}`}>
        <div>
          <ConnectButton  showBalance={false}/>
        </div>
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
            {/* {listTweet.map((tweets) => {
              return (
                <div key={tweets.id} className='p-2 my-2 bg-gray-300 rounded-sm'>
                  <div>{tweets.author}</div>
                  <div>content: {tweets.content}</div>
                  <div>
                    {/* <button onClick={() => handleLikeTweet(tweets.author, tweets.id)} className='mr-2'>Like</button> */}
                    <span>{tweets.likes}</span>
                  </div>
                </div>
              )
            })} */}
            </div>
          </div>)}
      </div>
      <Loading isLoading={isPending || isFetching}/>
    </div>
  );
}

export default App;
