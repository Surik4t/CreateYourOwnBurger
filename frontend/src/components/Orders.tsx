import { Flex, Text, Card, CardDescription, CardFooter, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { format } from "date-fns"

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

interface OrderProps {
    menuState: number;
}


const Orders: React.FC<OrderProps> = ({ menuState }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    //const [nextIndex, setNextIndex] = useState<number>(0);

    async function getOrders() {
        const url = "http://localhost:8000/orders";
        await axios.get(url)
            .then(response => setOrders(response.data))
            .catch((error: AxiosError) => console.error(error.message))
    }

    function orderPaid(order: Order) {
        return (order.status != "Waiting for payment")
    }

    useEffect(() => {getOrders()}, [menuState]);

    return (
        <Flex direction="column" rounded="xl" justifySelf="center" width="85%" height="100%">
            <Text color="black" >Orders</Text>
            <Flex direction="column" rounded="xl" width="100%" padding="1em">
                {orders.map((order) => (
                    <Flex key={order.id} margin="0.5em" bg="white" color="black" rounded="xl" justifyContent="space-between">
                        <Flex padding="1em" direction="column">
                            <Text>Order ID:</Text>
                            <Text>{order.id}</Text>
                            <Text>Status: {order.status}</Text>
                            <Text>{format(new Date(order.creation_datetime), "yyyy.MM.dd / HH:mm")}</Text>
                            <Text>Total price: <b>{order.price}₽</b></Text>
                            <Flex justifyContent="space-between" mt="0.5em">
                                <Button hidden={orderPaid(order)} bg="orange.400">Redact</Button>
                                <Button hidden={orderPaid(order)} bg="red.400">Cancel</Button>
                            </Flex>
                        </Flex>
                        <Flex overflowX="auto" marginEnd="auto">
                            {order.content.map((burger, burgerIndex) => (
                                <Card.Root
                                    key={burgerIndex}
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
                                        <CardDescription maxHeight="3em" overflow="hidden">
                                            {burger.ingredients.map(ingr => ingr.name ).join(", ")}
                                        </CardDescription>
                                    </Card.Body>
                                    <CardFooter alignSelf="end">
                                        <Text textStyle="xl" fontWeight="medium" letterSpacing="tight">
                                            {burger.price}₽
                                        </Text>
                                    </CardFooter>
                                </Card.Root>
                            ))}
                        </Flex>
                        <Flex margin="1em">
                            <Button hidden={orderPaid(order)} height="100%" width="150px" bg="orange.400">PAY</Button>
                        </Flex>
                    </Flex>
                ))}
            </Flex>
        </Flex>
    )
}

export default Orders;
