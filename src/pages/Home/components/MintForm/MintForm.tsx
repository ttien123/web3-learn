import { Button } from '@/components/ui/button';
import { contractAddress } from '@/config/config';
import React, { useEffect, useState } from 'react';
import { BaseError, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import contractMyTokenABI from '@/abi/myTokenAbi.json';
import { ethers } from 'ethers';
import useStateSignContract from '@/store/loadingSignContract';
import ModalApp from '@/components/ModalApp/ModalApp';
function MintForm() {
    const [isError, setIsError] = useState<boolean>(false);
    const [to, setTo] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const { setIsLoadingSignContract } = useStateSignContract();
    const { writeContract, isPending, data: txHash, error } = useWriteContract();
    const { isFetching, isFetched } = useWaitForTransactionReceipt({
        hash: txHash,
    });

    // console.log('error', (error as BaseError)?.message);
    const handleMint = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!to || !amount) {
            setIsError(true);
            return;
        }
        const mintAmount = ethers.parseUnits(amount, 18);
        console.log('mintAmount', mintAmount);
        
        writeContract({
            address: import.meta.env.VITE_CONTRACT_MYTOKEN_ADDRESS,
            abi: contractMyTokenABI,
            functionName: 'mint',
            args: [to, mintAmount],
        },
        {
          onError({stack}) {
            console.log('error', stack);
          }
        }
      );
        console.log('co xuong day', isPending);
        
        setIsError(false);
    };

    // useEffect(() => {
    //     setIsLoadingSignContract(isPending || isFetching);
    // }, [isPending, isFetching, setIsLoadingSignContract]);

    return (
        <div>
          <ModalApp initialOpen={isFetched} renderPopover={<div>thang cong</div>}/>
          <form onSubmit={handleMint} style={{ margin: '20px 0' }}>
              <h3 className="text-xl mb-4 font-semibold">Mint Token (Dành cho Admin)</h3>
              <div>
                  <label className="text-[16px]">Địa chỉ nhận: </label>
                  <input
                      type="text"
                      placeholder="0x..."
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="block w-full border border-black rounded-md p-2 outline-none my-2"
                  />
              </div>
              <div>
                  <label>Số lượng token: </label>
                  <input
                      type="text"
                      placeholder="Số token"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="block w-full border border-black rounded-md p-2 outline-none my-2"
                  />
              </div>
              {isError && <div className="text-red-500 text-sm">Vui lòng nhập đủ thông tin</div>}
              <Button
                  type="submit"
                  className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-12 py-2 w-full mt-4"
              >
                  Mint
              </Button>
          </form>
        </div>
    );
}

export default MintForm;
