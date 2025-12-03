import { Table, Text, List, Button, Flex, CloseButton, Input, Box, Card, CardFooter, Separator } from "@chakra-ui/react"
import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import type { Ingredient, Burger, Order } from "../common/types";
import BurgerImage from "../common/BurgerImage";
import BurgerInfo from "../common/BurgerInfo";
import ConfirmationDialog from "../common/ConfirmationDialog";


interface ConstructorProps {
    changeTab: (Tab: string) => void;
    menuState: number;
    orderInEdit: Order | null;
}


const Constructor: React.FC<ConstructorProps> = ({ changeTab, menuState, orderInEdit }) => {
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);    
    const [burgers, setBurgers] = useState<Burger[]>([]);
    const [burgerPrice, setBurgerPrice] = useState<number>(0);
    const [burgerWeight, setBurgerWeight] = useState<number>(0);
    const [burgerName, setBurgerName] = useState("");
    const [burgerModalOpen, setBurgerModalOpen] = useState(false);
    const [selectedBurger, setSelectedBurger] = useState<Burger | null>(null);
    const [selectedBurgerIndex, setSelectedBurgerIndex] = useState<number>(0);
    const [orderId, setOrderId] = useState<string>("")
    const [OrderPrice, setOrderPrice] = useState<number>(0);
    const [OrderWeight, setOrderWeight] = useState<number>(0);
    const [nextId, setNextId] = useState<number>(0);
    const { user } = useAuth();

    useEffect(() => {
        setBurgerPrice(selectedIngredients.reduce((sum, ingr) => sum + ingr.price, 0));
        setBurgerWeight(selectedIngredients.reduce((sum, ingr) => sum + ingr.weight, 0));
    }, [selectedIngredients])

    useEffect(() => {
        setOrderPrice(burgers.reduce((sum, burger) => sum + burger.price, 0));
        setOrderWeight(burgers.reduce((sum, burger) => sum + burger.weight, 0));
    }, [burgers])

    const clearBurger = () => {
        setSelectedIngredients([]);
        setBurgerName("");
    }

    const clearOrder = () => {
        setSelectedIngredients([]);
        setBurgers([]);
        setConfirmationDialogOpen(false);
    }

    const selectIngredient = (ingredient: Ingredient) => {
        if (selectedIngredients.length < 20) {
            setSelectedIngredients([
                ...selectedIngredients,
                {
                    name: ingredient.name,
                    weight: ingredient.weight,
                    price: ingredient.price,
                },
            ]);
            setNextId(nextId + 1);
        } else {
            toast.warn("Ingredient list is full!");
        }
    }

    const addToOrder = () => {
        if (selectedIngredients.length != 0) {
            setBurgers([
                ...burgers,
                {
                    name: burgerName || "Custom Burger",
                    ingredients: selectedIngredients,
                    weight: burgerWeight,
                    price: burgerPrice,
                },
            ]);
            clearBurger();
        } else {
            toast.warn("Add some ingredients first!");
        }
    }

    function loadOrder(order: any) {
        if (order) {
            setOrderId(order.id);
            setBurgers(order.content);
        }
    }

    useEffect(() => {getIngredients(), healthcheck()}, []);
    useEffect(() => {clearBurger(), clearOrder()}, [menuState]);
    useEffect(() => {loadOrder(orderInEdit)}, [orderInEdit]);

    async function getIngredients() {
        const url = "http://localhost:8000/ingredients";
        await axios.get(url)
            .then(response => setIngredients(response.data))
            .catch((error: AxiosError) => {
                toast.error(error.message);
                console.error(error.message);
            })    
    }


    async function healthcheck() {
        const url = "http://localhost:8000/healthcheck";
        await axios.get(url)
            .then(response => console.log(response.data.message))
            .catch((error: AxiosError) => {
                if (error.response) {
                    toast.error(error.message);
                    console.error("Error status code:", error.response.status);
                    console.error("Details:", error.message);
                }
            });
    }


    async function createOrder(content:Burger[])  {
        if (content.length != 0) {
            const order: Order = {
                customer: user?.username!,
                status: "Awaiting payment",
                content: content,
                price: +(OrderPrice.toFixed(2)),
                weight: OrderWeight,
                creation_datetime: new Date().toISOString(),
            }
            const url = "http://localhost:8000/orders";
            axios.post(url, order)
                .then(response => { 
                    console.log(response.data.message);
                    changeTab("orders");
                })
                .catch((error: AxiosError) => {
                    if (error.response) {
                        toast.error(error.message);
                        console.error("Error status code:", error.response.status);
                        console.error("Details:", error.message);
                    }
                });
        } else {
            toast.warn("Order is empty, add some burgers first!");
        }

    }


    async function changeOrder(content:Burger[], cancelEditing=false)  {
        if (content.length === 0 && !cancelEditing) {
            toast.warn("Order is empty, add some burgers first!");
        }

        let order: Order

        if (cancelEditing) {
            order = {
                customer: user?.username!,
                status: "Awaiting payment",
                content: content,
                price: orderInEdit?.price!,
                weight: orderInEdit?.weight!,
                creation_datetime: orderInEdit?.creation_datetime!,
            }
        } else {
            order = {
                customer: user?.username!,
                status: "Awaiting payment",
                content: content,
                price: OrderPrice,
                weight: OrderWeight,
                creation_datetime: new Date().toISOString(),
            }
        }

        const url = `http://localhost:8000/orders/${orderId}`;
        axios.put(url, order)
            .then(response => { 
                console.log(response.data.message);
                setOrderId("");
                changeTab("orders");
            })
            .catch((error: AxiosError) => {
                if (error.response) {
                    toast.error(error.message);
                    console.error("Error status code:", error.response.status);
                    console.error("Details:", error.message);
                }
            });
    }
   

    const handleCloseBurgerModal = useCallback(() => {
        setBurgerModalOpen(false);
    }, [burgerModalOpen])


    const openBurgerInfo = (burger: Burger, index: number) => {
        setSelectedBurger(burger);
        setSelectedBurgerIndex(index)
        setBurgerModalOpen(true);
    }

    const handleEditBurger = (burger: Burger, index: number) => {
        setSelectedIngredients(burger.ingredients);
        setBurgerName(burger.name);
        setBurgers(burger => 
            burger.filter((_, i) => i !== index));
        setBurgerModalOpen(false);
    }


    return (
        <Flex wrap="wrap">

            <ConfirmationDialog 
                dialogOpen={confirmationDialogOpen} 
                title="Do you really want to remove everything from the order?"
                handleConfirmation={clearOrder}
                handleClose={() => setConfirmationDialogOpen(false)}
            />

            <BurgerInfo 
                selectedBurger={selectedBurger}
                selectedBurgerIndex={selectedBurgerIndex}
                burgerModalOpen={burgerModalOpen}
                handleCloseBurgerModal={handleCloseBurgerModal}
                editBurger={handleEditBurger}
            />

            <Flex minWidth="100%" justifyContent="space-between" gap="2em" >

                {/* Таблица ингредиентов */} 
                <Flex bg="white" rounded="xl" height="33em" width="30%"
                    borderWidth="thick"
                    borderColor="white"
                    borderRadius="2xl"
                >
                    <Table.ScrollArea rounded="xl" height="100%" flex="1">
                        <Table.Root
                            bg="orange.200"
                            color="black"
                            variant="outline"
                            size="sm"
                            rounded="xl"
                            stickyHeader
                        >
                            <Table.Header bg="orange.400">
                                <Table.Row>
                                    <Table.ColumnHeader>Ingredient</Table.ColumnHeader>
                                    <Table.ColumnHeader>Price</Table.ColumnHeader>
                                    <Table.ColumnHeader textAlign="end">Add</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {ingredients.map((ingredient) => (
                                <Table.Row key={ingredient.name}>
                                    <Table.Cell>
                                        <Text textStyle="xl">
                                            {ingredient.name}
                                        </Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text textStyle="xl">
                                            ${ingredient.price.toFixed(2)}
                                        </Text>
                                    </Table.Cell>
                                    <Table.Cell textAlign="end">
                                        <Button
                                            rounded="full"
                                            border="solid" borderColor="white"
                                            size="xs"
                                            bg="orange.400"
                                            onClick={() => selectIngredient(ingredient)}
                                        >
                                            <Text textStyle="md">+</Text>
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    </Table.ScrollArea>
                </Flex>

                {/* Динамическая иллюстрация бургера */}
                <Flex direction="column" gap="1em" width="35%">
                    <Flex
                        bg="orange.200"
                        borderWidth="thick"
                        borderColor="white"
                        borderRadius="2xl"
                        position="relative"
                        minHeight="400px"
                    >
                        <BurgerImage ingredients={selectedIngredients} miniature={false}/>
                        <Box
                            bg="orange.400"
                            rounded="full"
                            position="absolute"
                            right="-0.5em"
                            bottom="-0.5em"
                        >                                          
                            <Text margin="5px" textStyle="2xl" fontWeight="medium" color="white">
                                ${burgerPrice.toFixed(2)}
                            </Text>
                        </Box>
                    </Flex>

                    <Flex direction="column" gap="1em">
                        <Input
                            value={burgerName}
                            onChange={(e) => setBurgerName(e.currentTarget.value)}
                            bg="orange.200"
                            color="black"
                            borderWidth="thick"
                            borderColor="white"
                            borderRadius="xl"
                            placeholder="Name your burger!"
                            variant="subtle"
                            size="xl"
                        />
                        <Button 
                            border="5px solid white"
                            borderRadius="xl" 
                            bg="orange.400" 
                            size="xl" 
                            onClick={addToOrder}>
                                Add to order
                        </Button>
                    </Flex> 
                </Flex>

                {/* Список добавленных ингредиентов */} 
                <Flex 
                    direction="column" 
                    color="black" 
                    bg="orange.200"
                    rounded="xl" 
                    minHeight="33em"
                    width="30%"
                    borderWidth="thick"
                    borderColor="white"
                    borderRadius="2xl"
                >
                    <List.Root
                        mt="0.5em"
                        ml="auto" mr="auto"
                        fontSize="xl"
                        width="80%"
                        overflowY="auto"
                        height="450px"
                    >
                        {selectedIngredients.map((selectedIngredient, selectedIngrIndex) => (
                            <List.Item key={selectedIngrIndex}>
                                <Flex justifyContent="space-between" mt="0.3em">
                                    <Text textStyle="xl">{selectedIngredient.name}</Text>
                                    <CloseButton 
                                        size="xs"
                                        rounded="full"
                                        border="solid" borderColor="white"
                                        bg="red.400"
                                        alignSelf="center"
                                        mr="1em"
                                        onClick={() => 
                                            setSelectedIngredients(ingr => 
                                                ingr.filter((_, index) => index !== selectedIngrIndex)
                                            )
                                        }
                                    >
                                    </CloseButton>
                                </Flex>
                                <Separator mt="0.3em" />
                            </List.Item>
                        )).reverse()}
                    </List.Root>
                    <Flex 
                        roundedBottom="xl" 
                        bg="orange.400" 
                        mt="auto"
                        justifyContent="space-between"
                        height="10%"
                    > 
                        <Text ml="1em" mt="auto" mb="auto" textStyle="2xl">Ingredients: {selectedIngredients.length}/20</Text>
                        <Button 
                            mr="1em" mt="auto" mb="auto" 
                            size="sm" 
                            bg="red.400" 
                            border="solid" borderColor="white" 
                            rounded="xl"
                            onClick={() => setSelectedIngredients([])}
                        >
                            Clear
                        </Button>
                    </Flex>
                </Flex>

            </Flex>
            
            {/* Состав заказа */}
            <Flex width="100%" minHeight="275px" mt="1em">
                <Flex width="100%" bg="white" color="black" rounded="xl">
                    <Flex overflowX="auto">

                    {burgers.map((burger, burgerIndex) => (
                        <Flex position="relative">
                            <Card.Root
                                key={burgerIndex}
                                bg="orange.200"
                                colorPalette="orange"
                                width="200px"
                                flexShrink={0}
                                margin="0.5em"
                                position="relative"
                                style={{ cursor:"pointer" }}
                                _hover={{
                                    outline: "2px solid orange"
                                }}
                                onClick={() => openBurgerInfo(burger, burgerIndex)}
                                >
                                <Box alignSelf="center" position="relative" height="60%" width="50%" overflow="hidden">
                                    <BurgerImage ingredients={burger.ingredients} miniature={true}/>
                                </Box>
                                <Card.Body>
                                    <Card.Title alignSelf="center">
                                        <Text textStyle="xl" fontWeight="medium" letterSpacing="tight">
                                            {burger.name}
                                        </Text>
                                    </Card.Title>
                                </Card.Body>
                            </Card.Root>
                            
                            <Box
                                bg="orange.400"
                                rounded="full"
                                position="absolute"
                                right="0.2em"
                                bottom="5px"
                            >                                          
                                <Text margin="5px" textStyle="lg" fontWeight="medium" color="white">
                                    ${burger.price.toFixed(2)}
                                </Text>
                            </Box>  

                            <Button
                                bg="orange.400"
                                rounded="full"
                                position="absolute"
                                size="sm"
                                bottom="5px"
                                left="0.2em"
                                onClick={() => setBurgers([...burgers, burger])}
                            >
                                add another
                            </Button>

                            <CloseButton
                                bg="red.400"
                                rounded="full"
                                position="absolute"
                                size="sm"
                                right="0"
                                onClick={() => 
                                    setBurgers(burger => 
                                        burger.filter((_, index) => index !== burgerIndex)
                                    )
                                }>
                                X
                            </CloseButton>

                        </Flex>
                    ))}
                    </Flex>

                    <Flex
                        ml="auto"
                        mt="0.5em" mb="0.5em"
                        justifyContent="space-between"
                        align="center"
                        direction="column"
                        width="20%"
                        height="275px"
                        color="black"
                    >
                        <Button
                            hidden={Boolean(orderId)}
                            bg="green.400"
                            height="50%"
                            width="90%"
                            rounded="xl"
                            textStyle="4xl"
                            onClick={() => createOrder(burgers)}
                        >
                            🛒
                        </Button>
                        <Button
                            hidden={!orderId}
                            bg="green.400"
                            height="50%"
                            width="90%"
                            rounded="xl"
                            textStyle="4xl"
                            onClick={() => changeOrder(burgers)}
                        >
                            Confirm
                        </Button>
                        <Button
                            hidden={Boolean(orderId)}
                            bg="red.400"
                            height="20%"
                            width="90%"
                            rounded="xl"
                            textStyle="3xl"
                            onClick={() => setConfirmationDialogOpen(true)}
                        >
                            Clear order
                        </Button>
                        <Button
                            hidden={!orderId}
                            bg="red.400"
                            height="20%"
                            width="90%"
                            rounded="xl"
                            textStyle="3xl"
                            onClick={() => changeOrder(orderInEdit?.content!, true)}
                        >
                            Cancel
                        </Button>
                        <Flex h="25%" w="90%" justifyContent="center" rounded="xl" bg="orange.400">
                            <Text mt="auto" mb="auto" textStyle="2xl" color="white">Total: <b>${OrderPrice.toFixed(2)}</b> </Text>
                        </Flex>
                    </Flex>

                </Flex>
                
            </Flex>   
        </Flex>
    );
}

export default Constructor;