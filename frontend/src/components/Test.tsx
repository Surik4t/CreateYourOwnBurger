import { Flex, Button, Dialog, CloseButton, Table, Heading } from "@chakra-ui/react";
import { useState } from "react";

const Test = () => {
    const [modalOpen, setModalOpen] = useState(false);

    const openOrderModal = () => {
        setModalOpen(true);
    }

    return (
        <Flex>
            <Button
                m="0.5em"
                onClick={() => openOrderModal()}
                height="100%"
                width="150px"
                bg="green.400"
                textStyle="6xl"
            >
                $
            </Button>
            
            <Dialog.Root 
                open={modalOpen} 
                onOpenChange={(e) => setModalOpen(e.open)}
            >
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content bg="white" color="gray.800">
                        <Dialog.Header>
                            <Dialog.Title>Order confirmation</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Heading size="2xl">Heading</Heading>
                            <Table.Root size="sm">
                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell>Cell</Table.Cell>
                                        <Table.Cell textAlign="end">123123₽</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell><b>total:</b></Table.Cell>
                                        <Table.Cell textAlign="end"><b>total₽</b></Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table.Root>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button variant="outline" onClick={() => setModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button>Save</Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
        </Flex>
    )
}

export default Test;