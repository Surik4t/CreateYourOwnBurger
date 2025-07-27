import { Flex, Text, Card, CardDescription, CardFooter } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

interface Ingredient {
    index: number,
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
    id: string,
    customer: string,
    status: string,
    content: Burger[],
    price: number,
    weight: number,
    creation_datetime: string,
}


const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    async function getOrders() {
        const url = "http://localhost:8000/orders";
        await axios.get(url)
            .then(response => setOrders(response.data))
            .catch((error: AxiosError) => console.error(error.message))
    }

    useEffect(() => {getOrders()}, []);

    return (
        <Flex rounded="xl" justifySelf="center" width="75%" height="100%" bg="white">
            <Flex direction="column" rounded="xl" width="100%" padding="1em" bg="pink">
                {orders.map((order) => (
                    <Flex padding="0.5em" bg="white" color="black" rounded="xl" overflowX="auto">
                        <Flex direction="column">
                            <Text>Order ID:</Text>
                            <Text>{order.id}</Text>
                            <Text>Status: {order.status}</Text>
                            <Text>{order.creation_datetime}</Text>
                        </Flex>
                        {order.content.map((burger) => (
                            <Card.Root
                                bg="orange.200"
                                colorPalette="orange"
                                width="200px"
                                maxHeight="200px"
                                flexShrink={0}
                                margin="0.5em"
                                >
                                <Card.Body>
                                    <Card.Title>
                                        {burger.name}
                                    </Card.Title>
                                    <CardDescription maxHeight="3em" overflow="hidden" textOverflow="clip">
                                        {burger.ingredients.map(ingr => ingr.name).join(", ")}
                                    </CardDescription>
                                </Card.Body>
                                <CardFooter alignSelf="end">
                                    <Text textStyle="2xl" fontWeight="medium" letterSpacing="tight" mt="2">
                                        {burger.price}₽
                                    </Text>
                                </CardFooter>
                            </Card.Root>
                        ))}
                    </Flex>
                ))}
            </Flex>
        </Flex>
    )
}

export default Orders;
