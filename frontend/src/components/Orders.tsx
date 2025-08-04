import { Flex, Text, Card, CardDescription, CardFooter, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { format } from "date-fns"

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
    id: string,
    customer: string,
    status: string,
    content: Burger[],
    price: number,
    weight: number,
    creation_datetime: string,
}

interface OrderProps {
    changeTab: (Tab: string) => void,
    handleSetEditOrder: (order: Order) => void,
    menuState: number,
}


const Orders: React.FC<OrderProps> = ({ changeTab, menuState, handleSetEditOrder }) => {
    const [orders, setOrders] = useState<Order[]>([]);

    const editOrder = (order: Order) => {
        changeTab("creator");
        handleSetEditOrder(order);
        if (order.status != "Editing") {
            order.status = "Editing"
            changeOrderStatus(order, "Editing");
        }
    }


    async function getOrders() {
        const url = "http://localhost:8000/orders";
        await axios.get(url)
            .then(response => setOrders(response.data))
            .catch((error: AxiosError) => console.error(error.message))
    }

    function orderStatusEquals(
        order: Order,
        ...statuses: Array<"Waiting for payment" | "Editing" | "Canceled">
    ): boolean {
        return (statuses.some(status => order.status == status))
    }

    useEffect(() => {getOrders()}, [menuState]);


    async function changeOrderStatus(order: Order, newStatus=order.status)  {
        const payload = {
            customer: order.customer,
            status: newStatus,
            content: order.content,
            price: order.price,
            weight: order.weight,
            creation_datetime: order.creation_datetime,
        }
        const url = `http://localhost:8000/orders/${order.id}`;
        axios.put(url, payload)
            .then(response => console.log(response.data.message))
            .catch((error: AxiosError) => {
                if (error.response) {
                    console.error("Error status code:", error.response.status);
                    console.error("Details:", error.message);
                }
            });
    }

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
                                <Button onClick={
                                    () => editOrder(order)}
                                    hidden={!orderStatusEquals(order, "Waiting for payment", "Editing")}
                                    bg="orange.400"
                                    >
                                        Edit
                                </Button>
                                <Button
                                onClick={() => (changeOrderStatus(order, "Canceled"), changeTab("orders"))}
                                hidden={!orderStatusEquals(order, "Waiting for payment", "Editing")}
                                bg="red.400"
                                >
                                    Cancel
                                </Button>
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
                            <Button
                                hidden={!orderStatusEquals(order, "Waiting for payment")} 
                                height="100%"
                                width="150px"
                                bg="orange.400"
                                >
                                    PAY
                            </Button>
                        </Flex>
                    </Flex>
                ))}
            </Flex>
        </Flex>
    )
}

export default Orders;
