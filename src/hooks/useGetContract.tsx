import { ethers } from "ethers";
import contractABI from "../abi/abi.json";
const useGetContract = async () => {
    if (!window.ethereum) throw new Error("Metamask chưa được cài đặt");
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(contractAddress, contractABI, signer);
  
}

export default useGetContract;
