import { Dialog, Button, Flex } from "@chakra-ui/react";


interface ConfirmationDialogProps {
    title: string,
    dialogOpen: boolean,
    handleConfirmation: () => void,
    handleClose: () => void,
}


const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ title, dialogOpen, handleConfirmation, handleClose }) => {

    return (
        <Dialog.Root
            size="xs"
            placement="center"
            open={dialogOpen}
            motionPreset="scale"
        >
            <Dialog.Backdrop bg="blackAlpha.600" />
            <Dialog.Positioner>
                <Dialog.Content color="black">
                    <Dialog.Header alignSelf="center">
                        <Dialog.Title> {title} </Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        <Flex justifyContent="space-between">
                            <Button w="40%" onClick={handleConfirmation} bg="green.400"> Confirm </Button>
                            <Button w="40%" onClick={handleClose} bg="orange.400"> Cancel </Button>
                        </Flex>
                    </Dialog.Body>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}

export default ConfirmationDialog;