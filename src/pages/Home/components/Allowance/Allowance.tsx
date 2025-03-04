import { Button } from '@/components/ui/button';
import { contractAddress } from '@/config/config';
import React, { useEffect, useState } from 'react';
import {   useReadContract, useWaitForTransactionReceipt, useWriteContract, } from 'wagmi';
import contractMyTokenABI from '@/abi/myTokenAbi.json';
import {  parseEther, SimulateContractErrorType } from 'viem';
import useStateSignContract from '@/store/loadingSignContract';
import ModalApp  from '@/components/ModalApp/ModalApp';
import ModalStep, { MODAL_STEP } from '@/components/ModalStep/ModalStep';
import { useQueryClient } from '@tanstack/react-query';
import { simulateContract } from '@wagmi/core'
import { config } from '@/main';
import { handleConvertToToken } from '@/utils/convertNumber';

function Allowance() {
    const [addressOwner, setAddressOwner] = useState<string>('');
    const [addressSpender, setAddressSpender] = useState<string>('');
    const [valueSearch, setValueSearch] = useState<string[]>([]);


    const { data: balanceToken, error } = useReadContract({
        abi: contractMyTokenABI,
        address: contractAddress.MyTokenAddress,
        functionName: 'allowance',
        args: [...valueSearch],
        query: {
            enabled: valueSearch.length > 0,
        },
    });

    console.log('balanceToken', balanceToken);
    console.log('error', {error});
    

    const handleBuyToken = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (addressOwner !== '' && addressSpender !== '') {
            setValueSearch([addressOwner, addressSpender]);
        }else{
            alert('nhap data vao di')
        }
    };

    return (
        <div>
          <form onSubmit={handleBuyToken} style={{ margin: '20px 0' }}>
              <h3 className="text-xl mb-4 font-semibold">Buy Token</h3>
              <div>
                  <label>owner: </label>
                  <input
                      type="text"
                      placeholder="token"
                      value={addressOwner}
                      onChange={(e) => setAddressOwner(e.target.value)}
                      className="block w-full border border-black rounded-md p-2 outline-none my-2"
                  />
              </div>
              <div>
                  <label>spender: </label>
                  <input
                      type="text"
                      placeholder="token"
                      value={addressSpender}
                      onChange={(e) => setAddressSpender(e.target.value)}
                      className="block w-full border border-black rounded-md p-2 outline-none my-2"
                  />
              </div>
              <Button
                  type="submit"
                  className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-12 py-2 w-full mt-4"
              >
                  buy
              </Button>
          </form>
          <div>
            {handleConvertToToken(balanceToken as string || '0')}
          </div>
        </div>
    );
}

export default Allowance;
