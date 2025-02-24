import { Button } from '@/components/ui/button';
import { contractAddress } from '@/config/config';
import React, { useEffect, useState } from 'react';
import {  useSimulateContract, useWaitForTransactionReceipt, useWriteContract, } from 'wagmi';
import contractMyTokenABI from '@/abi/myTokenAbi.json';
import { BaseError, ContractFunctionExecutionError, ContractFunctionExecutionErrorType, parseEther, SimulateContractErrorType } from 'viem';
import useStateSignContract from '@/store/loadingSignContract';
import ModalApp  from '@/components/ModalApp/ModalApp';
import ModalStep, { MODAL_STEP } from '@/components/ModalStep/ModalStep';
import { useQueryClient } from '@tanstack/react-query';
import { simulateContract } from '@wagmi/core'
import { config } from '@/main';
interface Props {
    queryKeyETH: any;
    queryKeyToken: any;
}
function BuyTokenForm({queryKeyETH, queryKeyToken}: Props) {
    const queryClient = useQueryClient();
    const [isError, setIsError] = useState<boolean>(false);
    const [stepModal, setStepModal] = useState<MODAL_STEP>(MODAL_STEP.READY);
    const [amount, setAmount] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const { setIsLoadingSignContract } = useStateSignContract();
    const { writeContract, isPending, data: txHash } = useWriteContract();
    const { isFetching, status: statusWaitTx } = useWaitForTransactionReceipt({
        hash: txHash,
    });



    
    const handleBuyToken = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!amount) {
            setIsError(true);
            return;
        }
        try {
            const ethAmount = parseEther((Number(amount) * 0.001).toString());
            const {request} = await simulateContract(config, {
                address: contractAddress.MyTokenAddress,
                abi: contractMyTokenABI,
                functionName: 'buy',
                args: [amount],
                value: ethAmount,
            })
            writeContract(request,
            {
                onError() {
                    setStepModal(MODAL_STEP.FAILED);
                },
                onSuccess() {
                    setStepModal(MODAL_STEP.SUCCESS);
                },
            }
            );
        } catch (error: any) {
            const nameError = ((error as BaseError)?.cause as any)?.cause?.name
            if (nameError === 'InsufficientFundsError') {
                setErrorMessage("You don't have enough ETH to buy token");
            }
            setStepModal(MODAL_STEP.FAILED);
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
          <ModalStep open={stepModal !== MODAL_STEP.READY} setOpen={setStepModal} contentStep={errorMessage} statusStep={stepModal}/>
          <ModalApp renderPopover/>
          <form onSubmit={handleBuyToken} style={{ margin: '20px 0' }}>
              <h3 className="text-xl mb-4 font-semibold">Buy Token</h3>
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
                  buy
              </Button>
          </form>
        </div>
    );
}

export default BuyTokenForm;
