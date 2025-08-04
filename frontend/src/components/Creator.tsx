import { Table, Text, List, Button, Flex, CloseButton, Input, Box, Image, Card, CardDescription, CardFooter } from "@chakra-ui/react"
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";


interface Ingredient {
    name: string,
    weight: number,
    price: number,
}

interface Burger {
    name: string,
    ingredients: Ingredient[],
    weight: number,
    price: number,
}

interface Order {
    customer: string,
    status: string,
    content: Burger[],
    price: number,
    weight: number,
    creation_datetime: string,
}

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
    const [orderId, setOrderId] = useState<string>("")
    const [OrderPrice, setOrderPrice] = useState<number>(0);
    const [OrderWeight, setOrderWeight] = useState<number>(0);
    const [nextId, setNextId] = useState<number>(0);
    const len = selectedIngredients.length;

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
        setBurgers([]);
    }

    const selectIngredient = (ingredient: Ingredient) => {
        setSelectedIngredients([
            {
                name: ingredient.name,
                weight: ingredient.weight,
                price: ingredient.price,
            },
            ...selectedIngredients,
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

    useEffect(() => {getIngredients(), healthcheck}, []);
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
                customer: "Guest",
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
                customer: "Guest",
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
   
    return (
        <Flex wrap="wrap">
            <Flex minWidth="100%" justifyContent="space-between" gap="2em" >

                {/* Динамическая иллюстрация бургера */}
                <Flex direction="column" gap="1em">
                    <Image
                        rounded="xl"
                        src="https://img.freepik.com/free-photo/delicious-burgers-studio_23-2150902146.jpg?semt=ais_items_boosted&w=740"
                        height="400px"
                        width="400px"
                        alt="BURGA"
                    />
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
                    <Text ml="1em"textStyle="2xl">Ingredients: {len}/15</Text>
                    <List.Root
                        ml="auto" mr="auto"
                        fontSize="xl"
                        width="80%"
                        >
                        {selectedIngredients.map((selectedIngredient, selectedIngrIndex) => (
                            <List.Item key={selectedIngrIndex}>
                                <Flex justifyContent="space-between">
                                    {selectedIngredient.name}
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
                        ))}
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
                            >
                            <Card.Body>
                                <Card.Title>
                                    {burger.name}
                                </Card.Title>
                                <CardDescription>
                                    {burger.ingredients.map(ingr => ingr.name).join(", ")}
                                </CardDescription>
                            </Card.Body>
                            <CardFooter>
                                <Text textStyle="2xl" fontWeight="medium" letterSpacing="tight" mt="2">
                                    {burger.price}₽
                                </Text>
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
                        bg="orange.400"
                        height="50%"
                        width="90%"
                        textStyle="4xl"
                        onClick={() => createOrder(burgers)}
                    >
                        Buy
                    </Button>
                    <Button
                        hidden={!orderId}
                        bg="orange.400"
                        height="50%"
                        width="90%"
                        textStyle="4xl"
                        onClick={() => changeOrder(burgers)}
                    >
                        Confirm
                    </Button>
                    <Button
                        bg="orange.300"
                        height="20%"
                        width="90%"
                        textStyle="3xl"
                        onClick={clearOrder}
                    >
                        Clear order
                    </Button>
                    <Text>Total price: {OrderPrice}₽, Weight: {OrderWeight}g </Text>
                </Flex>
            </Flex>    
    
        </Flex>
    );
}

export default Creator;