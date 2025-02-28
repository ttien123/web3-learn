import { Button } from '@/components/ui/button';
import { contractAddress } from '@/config/config';
import React, { useEffect, useState } from 'react';
import {  useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import contractMyTokenABI from '@/abi/myTokenAbi.json';
import { ethers } from 'ethers';
import useStateSignContract from '@/store/loadingSignContract';
import ModalApp  from '@/components/ModalApp/ModalApp';
import ModalStep, { MODAL_STEP } from '@/components/ModalStep/ModalStep';
import { useQueryClient } from '@tanstack/react-query';
import { config } from '@/main';
import { simulateContract } from '@wagmi/core'

interface Props {
    queryKeyETH: any;
    queryKeyToken: any;
}
function MintForm({queryKeyETH, queryKeyToken}: Props) {
    const queryClient = useQueryClient();
    const [isError, setIsError] = useState<boolean>(false);
    const [to, setTo] = useState<string>('');
    const [stepModal, setStepModal] = useState<MODAL_STEP>(MODAL_STEP.READY);
    const [amount, setAmount] = useState<string>('');
    const { setIsLoadingSignContract } = useStateSignContract();
    const { writeContract, isPending, data: txHash } = useWriteContract();
    const { isFetching, status: statusWaitTx } = useWaitForTransactionReceipt({
        hash: txHash,
    });

    const handleMint = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!to || !amount) {
            setIsError(true);
            return;
        }
        const mintAmount = ethers.parseUnits(amount, 18);

        try {
            const {request} = await simulateContract(config, {
                address: contractAddress.MyTokenAddress,
                abi: contractMyTokenABI,
                functionName: 'mint',
                args: [to, mintAmount],
                })
            writeContract(request);
        } catch (error) {
            console.log({ error });
            
        }
        
        setIsError(false);
    };

    useEffect(() => {
        if (isPending || isFetching) {
            setStepModal(MODAL_STEP.PROCESSING);
        }
    }, [isPending, isFetching, setIsLoadingSignContract]);

    useEffect(() => {
        if (statusWaitTx === 'success') {
            setStepModal(MODAL_STEP.SUCCESS);
            queryClient.invalidateQueries({ queryKey: queryKeyToken });
            queryClient.invalidateQueries({ queryKey: queryKeyETH });
        }
        if (statusWaitTx === 'error') {
            setStepModal(MODAL_STEP.FAILED);
        }
    }, [statusWaitTx]);

    return (
        <div>
          <ModalStep open={stepModal !== MODAL_STEP.READY} setOpen={setStepModal} statusStep={stepModal}/>
          <ModalApp renderPopover/>
          <form onSubmit={handleMint} style={{ margin: '20px 0' }}>
              <h3 className="text-xl mb-4 font-semibold">Mint Token (For Admin)</h3>
              <div>
                  <label className="text-[16px]">To address: </label>
                  <input
                      type="text"
                      placeholder="0x..."
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="block w-full border border-black rounded-md p-2 outline-none my-2"
                  />
              </div>
              <div>
                  <label>Token: </label>
                  <input
                      type="text"
                      placeholder="token"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="block w-full border border-black rounded-md p-2 outline-none my-2"
                  />
              </div>
              {isError && <div className="text-red-500 text-sm">Please enter complete information</div>}
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
