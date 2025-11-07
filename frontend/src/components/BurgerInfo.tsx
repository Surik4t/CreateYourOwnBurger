import { Flex, Dialog, Table, Separator, Text, Button, CloseButton } from "@chakra-ui/react";
import type { Burger, CombinedIngredient } from "../common/types";


interface BurgerInfoProps {
    selectedBurger: Burger | null;
    burgerModalOpen: boolean;
}

const BurgerInfo: React.FC<BurgerInfoProps> = ({ selectedBurger, burgerModalOpen }) => {
    //const [burgerModalOpen, setBurgerModalOpen] = useState(false);

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
                //onOpenChange={(e) => setBurgerModalOpen(e.open)}
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
                                        <Table.Cell textAlign="end"> {ingr.price}₽ </Table.Cell>
                                    </Table.Row>
                                ))}
                                <Table.Row>
                                    <Table.Cell></Table.Cell>
                                    <Table.Cell />
                                    <Table.Cell textAlign="end"> <b>{selectedBurger?.price}₽</b></Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table.Root>
                        <Separator mb="1em"/>
                        <Flex justifyContent="space-between">
                            <p>Send receipt to your email</p>
                        </Flex>
                        <Flex mt="1em" justifyContent="space-between">
                            <Text textStyle="xl" fontWeight="medium">Total: </Text>
                            <Text textStyle="xl" fontWeight="medium">{selectedBurger && selectedBurger!.price}₽</Text>
                        </Flex>
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Dialog.ActionTrigger asChild>
                            <Button bg="orange.400">Cancel</Button>
                        </Dialog.ActionTrigger>
                        <Button
                            bg="green.500"
                        >
                            Confirm</Button>
                    </Dialog.Footer>
                    <Dialog.CloseTrigger asChild>
                        <CloseButton bg="orange.400" size="sm" />
                    </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
        </Flex>
    )
}

export default BurgerInfo;