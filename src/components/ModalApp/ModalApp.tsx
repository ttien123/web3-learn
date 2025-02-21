import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';

interface Props {
    children?: React.ReactNode;
    renderPopover: React.ReactNode;
    initialOpen?: boolean;
}

const ModalApp = ({ children, renderPopover, initialOpen }: Props) => {
    const [open, setOpen] = useState(initialOpen);
    return (
        <Dialog defaultOpen={initialOpen} open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent  className="sm:max-w-[425px]">{renderPopover}</DialogContent>
        </Dialog>
    );
};

export default ModalApp;
