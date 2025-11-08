import { Table, Text, List, Button, Flex, CloseButton, Input, Box, Image, Card, CardDescription, CardFooter } from "@chakra-ui/react"
import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import bottomBun from '../assets/bottom-bun.png'
import beefpatty from '../assets/beef-patty.png'
import cheese from '../assets/cheese.png'
import ketchup from '../assets/ketchup.png'
import mayo from '../assets/mayo.png'
import lettuce from '../assets/lettuce.png'
import mustard from '../assets/mustard.png'
import tomato from '../assets/tomato.png'
import pickles from '../assets/pickles.png'
import type { Ingredient, Burger, Order } from "../common/types";
import BurgerInfo from "./BurgerInfo";


interface CreatorProps {
    changeTab: (Tab: string) => void;
    menuState: number;
    orderInEdit: Order | null;
}


const Creator: React.FC<CreatorProps> = ({ changeTab, menuState, orderInEdit }) => {
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
    const len = selectedIngredients.length;
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
    }

    const selectIngredient = (ingredient: Ingredient) => {
        setSelectedIngredients([
            ...selectedIngredients,
            {
                name: ingredient.name,
                weight: ingredient.weight,
                price: ingredient.price,
            },
        ]);
        setNextId(nextId + 1);
    }

    const addToOrder = () => {
        setBurgers([
            {
                name: burgerName || "Custom Burger",
                ingredients: selectedIngredients,
                weight: burgerWeight,
                price: burgerPrice,
            },
            ...burgers,
        ]);
        clearBurger();
    }

    function loadOrder(order: any) {
        if (order) {
            console.log(order);
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
            .catch((error: AxiosError) => console.error(error.message))    
    }


    async function healthcheck() {
        const url = "http://localhost:8000/healthcheck";
        await axios.get(url)
            .then(response => console.log(response.data.message))
            .catch((error: AxiosError) => {
                if (error.response) {
                    console.error("Error status code:", error.response.status);
                    console.error("Details:", error.message);
                }
            });
    }


    async function createOrder(content:Burger[])  {
        if (content.length != 0) {
            const order: Order = {
                customer: user?.username!,
                status: "Waiting for payment",
                content: content,
                price: OrderPrice,
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
                        console.error("Error status code:", error.response.status);
                        console.error("Details:", error.message);
                    }
                });
        } else {
            console.error("Empty order.")
            return;
        }

    }


    async function changeOrder(content:Burger[])  {
        if (content.length != 0) {
            const order: Order = {
                customer: user?.username!,
                status: "Waiting for payment",
                content: content,
                price: OrderPrice,
                weight: OrderWeight,
                creation_datetime: new Date().toISOString(),
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
                        console.error("Error status code:", error.response.status);
                        console.error("Details:", error.message);
                    }
                });
        } else {
            console.error("Empty order.")
            return;
        }
    }
   

    const ingredientImages: Record<string, string> = {
        "Bun": bottomBun,
        "Beef Patty": beefpatty,
        "Cheese": cheese,
        "Ketchup": ketchup,
        "Mayo": mayo,
        "Lettuce": lettuce,
        "Mustard": mustard,
        "Tomato Slice": tomato,
        "Pickles": pickles
    };


    const getIngredientHeight = (ingredient: string, miniature=true) => {
        const sauces = ["Ketchup", "Mayo", "Mustard"]
        const slices = ["Cheese", "Tomato Slice", "Pickles"]
        const meat = ["Beef Patty"]

        let result = 35;

        if (sauces.includes(ingredient)) {
            result = 5;
        } else if (slices.includes(ingredient)) {
            result = 15;
        } else if (meat.includes(ingredient)) {
            result = 10;
        }

        if (miniature) {
            return result/2.5
        } else {
            return result
        }
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

            <BurgerInfo 
                selectedBurger={selectedBurger}
                selectedBurgerIndex={selectedBurgerIndex}
                burgerModalOpen={burgerModalOpen}
                handleCloseBurgerModal={handleCloseBurgerModal}
                editBurger={handleEditBurger}
            />

            <Flex minWidth="100%" justifyContent="space-between" gap="2em" >

                {/* Динамическая иллюстрация бургера */}
                <Flex direction="column" gap="1em">
                    <Flex
                        bg="orange.200"
                        borderWidth="thick"
                        borderColor="white"
                        borderRadius="2xl"
                        position="relative"
                        minHeight="400px"
                        justifyContent="center"
                    >
                        {selectedIngredients.map((item, index) => {
                            const accumulatedHeight = selectedIngredients
                                .slice(0, index)
                                .reduce((total, ingredient) => total + getIngredientHeight(ingredient.name, false), 0);
                            console.log(index, accumulatedHeight);
                            return (
                                <Image
                                    key={index} 
                                    zIndex={index} 
                                    src={ingredientImages[item.name]}
                                    bottom={`${accumulatedHeight}px`}
                                    position="absolute"
                                />
                            )
                        })}
                    </Flex>
                    <Flex direction="column" width="400px" gap="1em">
                        <Input
                            value={burgerName}
                            onChange={(e) => setBurgerName(e.currentTarget.value)}
                            bg="orange.200"
                            color="black"
                            placeholder="Name your burger!"
                            variant="subtle"
                            >
                        </Input>
                        <Button bg="orange.400" onClick={addToOrder}>
                            Add to order
                        </Button>
                    </Flex>
                </Flex>

                {/* Список добавленных ингредиентов */} 
                <Flex direction="column" color="black" bg="white" rounded="xl" width="25%">
                    <Text ml="1em"textStyle="xl">Ingredients: {len}/20</Text>
                    <List.Root
                        ml="auto" mr="auto"
                        fontSize="xl"
                        width="80%"
                        >
                        {selectedIngredients.map((selectedIngredient, selectedIngrIndex) => (
                            <List.Item key={selectedIngrIndex}>
                                <Flex justifyContent="space-between" mt="-0.3em">
                                    <Text textStyle="sm">{selectedIngredient.name}</Text>
                                    <CloseButton 
                                        size="2xs"
                                        bg="orange.400"
                                        alignSelf="center"
                                        onClick={() => 
                                            setSelectedIngredients(ingr => 
                                                ingr.filter((_, index) => index !== selectedIngrIndex)
                                            )
                                        }
                                    >
                                    </CloseButton>
                                </Flex>
                            </List.Item>
                        )).reverse()}
                    </List.Root>
                    <Text mt="auto" ml="auto" mr="1em" textStyle="2xl">Price: {burgerPrice}₽</Text>
                </Flex>

                {/* Таблица ингредиентов */} 
                <Flex width="50%">
                    <Table.ScrollArea height="100%" flex="1">
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
                                    <Table.Cell>{ingredient.name}</Table.Cell>
                                    <Table.Cell>{ingredient.price}</Table.Cell>
                                    <Table.Cell textAlign="end">
                                        <Button
                                            bg="orange.400"
                                            onClick={() => selectIngredient(ingredient)}
                                        >
                                            +
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    </Table.ScrollArea>
                </Flex>

            </Flex>
            
            {/* Состав заказа */}
            <Flex width="100%" minHeight="275px" mt="1em">
                <Flex width="80%" bg="white" color="black" rounded="xl" overflowX="auto">
                    {burgers.map((burger, burgerIndex) => (
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
                            <Box alignSelf="center" position="relative" height="150px" width="50%" overflow="hidden">
                                {burger.ingredients.map((item, index) => {
                                    const accumulatedHeight = burger.ingredients
                                        .slice(0, index)
                                        .reduce((total, ingredient) => total + getIngredientHeight(ingredient.name), 0);
                                    console.log(index, accumulatedHeight);
                                    return (
                                        <Image
                                            key={`${burgerIndex}-${index}`} 
                                            zIndex={index} 
                                            src={ingredientImages[item.name]}
                                            bottom={`${accumulatedHeight}px`}
                                            position="absolute"
                                        />
                                    )  
                                })}
                            </Box>
                            <Card.Body>
                                <Card.Title>
                                    {burger.name}
                                </Card.Title>
                            </Card.Body>
                            <CardFooter>
                                <Text textStyle="xl" fontWeight="medium" letterSpacing="tight">
                                    {burger.price}₽
                                </Text>
                                <CloseButton
                                    bg="red.400"
                                    size="2xs"
                                    rounded="2xl"
                                    onClick={() => 
                                        setBurgers(burger => 
                                            burger.filter((_, index) => index !== burgerIndex)
                                        )
                                    }>
                                    X
                                </CloseButton>
                            </CardFooter>
                        </Card.Root>
                    ))}
                </Flex>
                
                <Flex
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
                        textStyle="3xl"
                        onClick={clearOrder}
                    >
                        Clear order
                    </Button>
                    <Button
                        hidden={!orderId}
                        bg="red.400"
                        height="20%"
                        width="90%"
                        textStyle="3xl"
                        onClick={() => changeOrder(burgers)}
                    >
                        Cancel
                    </Button>
                    <Text>Total price: {OrderPrice}₽, Weight: {OrderWeight}g </Text>
                </Flex>
                
            </Flex>   
        </Flex>
    );
}

export default Creator;