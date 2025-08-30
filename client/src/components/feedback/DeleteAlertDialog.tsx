import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

interface DeleteAlertDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    title?: string;
    description?: string;
    itemName?: string;
    confirmText?: string;
    cancelText?: string;
}

const DeleteAlertDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    itemName,
    confirmText = 'Delete',
    cancelText = 'Cancel',
}: DeleteAlertDialogProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const defaultDescription = itemName
        ? `This action cannot be undone. This will permanently delete "${itemName}" and remove all associated data.`
        : 'This action cannot be undone. This will permanently delete the item and remove all associated data.';

    const finalDescription = description || defaultDescription;

    const handleConfirm = async () => {
        try {
            setIsLoading(true);
            await Promise.resolve(onConfirm());
            onClose();
        } catch (error) {
            console.error('Delete operation failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="sm:max-w-[425px]">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-600">
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600">
                        {finalDescription}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose} disabled={isLoading}>
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    >
                        {isLoading ? 'Deleting...' : confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteAlertDialog;
