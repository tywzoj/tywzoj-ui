import { Dialog, DialogBody, DialogContent, DialogSurface, DialogTitle } from "@fluentui/react-components";

export interface IProblemSubmissionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

export const ProblemSubmissionDialog: React.FC<IProblemSubmissionDialogProps> = (props) => {
    const { isOpen, onClose } = props;

    // TODO: Implement dialog content

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(_, data) => {
                if (!data.open) {
                    onClose();
                }
            }}
        >
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>Dialog title</DialogTitle>
                    <DialogContent></DialogContent>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};
