import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { X } from "lucide-react";
import { useAccount } from "wagmi";

export enum MODAL_STEP {
    PROCESSING = 'PROCESSING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
    READY = 'READY',
}
interface Props {
    children?: React.ReactNode;
    renderPopover?: React.ReactNode;
    open?: boolean;
    setOpen: React.Dispatch<React.SetStateAction<MODAL_STEP>>;
    statusStep?: MODAL_STEP | null;
    contentStep?: string;
}

interface PropsContent {
    content?: string;
    setOpen?: React.Dispatch<React.SetStateAction<MODAL_STEP>>;
}

const SuccessContent = ({ content, setOpen }: PropsContent) => {
    return (
        <div className={`flex items-center justify-center gap-4 flex-col`}>
            <button onClick={() => setOpen?.(MODAL_STEP.READY)} className="absolute right-4 top-4">
                <X className="h-4 w-4" />
            </button>
            <div className="text-black text-center font-medium">{content || 'Transaction successfully!'}</div>
        </div>
    );
};

const FailedContent = ({ content, setOpen }: PropsContent) => {
    const {isConnected} = useAccount()
    return (
        <div className={`flex items-center justify-center gap-4 flex-col`}>
            <button onClick={() => setOpen?.(MODAL_STEP.READY)} className="absolute right-4 top-4">
                <X className="h-4 w-4" />
            </button>
            <div className="text-black text-center font-medium">{content || 'Transaction failed!'}</div>
            {!isConnected && <div>
                <div className="text-black text-center font-medium">Please connect wallet</div>
            </div>}
        </div>
    );
};

const ProcessingContent = ({ content }: PropsContent) => {
    return (
        <div className={`flex items-center justify-center gap-4 flex-col`}>
            <div className="text-black text-center font-medium">{content || 'Transaction processing...'}</div>
        </div>
    );
};

const ModalStep = ({ children, renderPopover, open, setOpen, statusStep, contentStep }: Props) => {
    return (
        <AlertDialog open={open}>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            {renderPopover && <AlertDialogContent className="sm:max-w-[425px]">
                {renderPopover}
            </AlertDialogContent>}
            {statusStep && <AlertDialogContent className="sm:max-w-[425px]">
                {statusStep === MODAL_STEP.PROCESSING && <ProcessingContent content={contentStep} />}
                {statusStep === MODAL_STEP.SUCCESS && <SuccessContent setOpen={setOpen} content={contentStep} />}
                {statusStep === MODAL_STEP.FAILED && <FailedContent setOpen={setOpen} content={contentStep} />}
            </AlertDialogContent>}
        </AlertDialog>
    );
};

export default ModalStep;
