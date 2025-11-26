import { Flex, Dialog, Table, Separator, Text, Button, CloseButton } from "@chakra-ui/react";
import type { Burger, CombinedIngredient } from "./types";


interface BurgerInfoProps {
    selectedBurger: Burger | null;
    selectedBurgerIndex?: number;
    burgerModalOpen: boolean;
    handleCloseBurgerModal: () => void;
    editBurger?: (burger: Burger, index: number) => void;
}

const BurgerInfo: React.FC<BurgerInfoProps> = ({ selectedBurger, selectedBurgerIndex, burgerModalOpen, handleCloseBurgerModal, editBurger }) => {

    const combineIngredients = (burger: Burger): CombinedIngredient[] => {
        const map = new Map<string, CombinedIngredient>();
        
        burger.ingredients.forEach(ingr => {
            const existing = map.get(ingr.name);
            if (existing) {
                existing.quantity++;
                existing.price += ingr.price;
            } else {
                map.set(ingr.name, {
                    name: ingr.name,
                    quantity: 1,
                    price: ingr.price
                });
            }
        });
        return Array.from(map.values());
    };

    return (
        <Flex>
            <Dialog.Root
                lazyMount 
                placement="center"
                open={burgerModalOpen}
                motionPreset="scale"
                >
                <Dialog.Backdrop bg="blackAlpha.600" />
                <Dialog.Positioner>
                    <Dialog.Content color="gray.800">
                    <Dialog.Header>
                        <Dialog.Title color="gray.800">
                            { selectedBurger?.name }
                        </Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        <Table.Root size="sm">
                            <Table.Body>
                                {selectedBurger && combineIngredients(selectedBurger).map((ingr, ingrIndex) => (
                                    <Table.Row key={ingrIndex}>
                                        <Table.Cell> {ingr.name} </Table.Cell>
                                        <Table.Cell> x{ingr.quantity} </Table.Cell>
                                        <Table.Cell textAlign="end"> ${ingr.price} </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                        <Separator mb="1em"/>
                        <Flex mt="1em" justifyContent="space-between">
                            <Text textStyle="xl" fontWeight="medium">Total: </Text>
                            <Text textStyle="xl" fontWeight="medium">${selectedBurger && selectedBurger!.price}</Text>
                        </Flex>
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Button 
                            bg="orange.400"
                            hidden={selectedBurgerIndex === undefined}
                            onClick={() => editBurger && editBurger(selectedBurger!, selectedBurgerIndex!)}
                            >
                                Edit
                        </Button>
                    </Dialog.Footer>
                    <Dialog.CloseTrigger asChild>
                        <CloseButton onClick={handleCloseBurgerModal} bg="orange.400" size="sm" />
                    </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
        </Flex>
    )
}

export default BurgerInfo;