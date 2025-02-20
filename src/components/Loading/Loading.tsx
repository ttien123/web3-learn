const Loading = ({ isLoading }: { isLoading?: boolean }) => {
    return (
        <>
            {isLoading && <div className="fixed inset-0 flex items-center justify-center bg-[#0b0e1426]">
                {<div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600" />}
            </div>}
        </>
    )
};

export default Loading;
