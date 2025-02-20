import useStateSignContract from "@/store/loadingSignContract";

const Loading = () => {
    const { message, isLoadingSignContract } = useStateSignContract()
    return (
        <>
            {isLoadingSignContract && <div className="fixed inset-0 flex items-center flex-col justify-center bg-[#0b0e149e]">
                <div className="w-[425px] rounded-xl p-8 bg-slate-500 grid place-items-center">
                    {<div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600" />}
                    <div className="text-white text-2xl mt-4">
                        {message || "Loading..."}
                    </div>
                </div>
            </div>}
        </>
    )
};

export default Loading;
