import { Flex, Text, Card, CardDescription, CardFooter, Button, Dialog, CloseButton, Table, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { format } from "date-fns"
import { useAuth } from "../contexts/AuthContext";

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
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const { user } = useAuth();
    const token = localStorage.getItem('access_token');

    const api = axios.create({
        baseURL: "http://localhost:8000",
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const editOrder = (order: Order) => {
        changeTab("creator");
        handleSetEditOrder(order);
        if (order.status != "Editing") {
            order.status = "Editing"
            changeOrderStatus(order, "Editing");
        }
    }


    async function getOrders() {
        const response = await api.get(`/orders?customer=${user?.username}`)
            .then(response => setOrders(response.data))
            .catch((error: AxiosError) => console.error(error.message))
    }


    function orderStatusEquals(
        order: Order,
        ...statuses: Array<"Waiting for payment" | "Editing" | "Canceled">
    ): boolean {
        return (statuses.some(status => order.status == status))
    }


    function applyColorToStatus(status: string) {
        switch(status) {
        case "Canceled":
            return <span style={{color: 'red', fontWeight: 'bold'}}>{status}</span>;
        case "Complete":
            return <span style={{color: 'green', fontWeight: 'bold'}}>{status}</span>;
        default:
            return <span style={{color: 'orange', fontWeight: 'bold'}}>{status}</span>;
        }
    }

    const openOrderModal = (order: Order) => {
        setSelectedOrder(order);
        setModalOpen(true);
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
            .then(response => {
                console.log(response.data.message)
                getOrders();
            })
            .catch((error: AxiosError) => {
                if (error.response) {
                    console.error("Error status code:", error.response.status);
                    console.error("Details:", error.message);
                }
            });
    }

    return (
        <Flex direction="column" rounded="xl" justifySelf="center" width="85%" height="100%">
            <Flex direction="column" rounded="xl" width="100%">
                {orders.map((order) => (
                    <Flex key={order.id} margin="0.5em" bg="white" color="black" rounded="xl">
                        <Flex padding="1em" direction="column">
                            <Text>Order ID:</Text>
                            <Text>{order.id}</Text>
                            <Text>Status: {applyColorToStatus(order.status)}</Text>
                            <Text>{format(new Date(order.creation_datetime), "yyyy.MM.dd / HH:mm")}</Text>
                            <Text>Total price: <b>{order.price}₽</b></Text>
                            <Flex justifyContent="space-between" mt="0.5em">
                                <Button onClick={
                                    () => (editOrder(order), getOrders)}
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

                        <Button
                            m="0.5em"
                            onClick={() => openOrderModal(order)}
                            hidden={!orderStatusEquals(order, "Waiting for payment")} 
                            height="100%"
                            width="150px"
                            bg="green.400"
                            textStyle="6xl"
                        >
                        $
                        </Button>
                    </Flex>
                ))}
            </Flex>
            <Dialog.Root
                lazyMount 
                placement="center"
                open={modalOpen}
                motionPreset="scale"
                onOpenChange={(e) => setModalOpen(e.open)}
                >
                <Dialog.Backdrop bg="blackAlpha.600" />
                <Dialog.Positioner>
                    <Dialog.Content bg="white" color="gray.800">
                    <Dialog.Header>
                        <Dialog.Title color="gray.800">
                            Order confirmation {selectedOrder && `- ${selectedOrder.id}`}
                        </Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        {selectedOrder && selectedOrder.content.map((burger, burgerIndex) => (
                            <div key={burgerIndex}>
                                <Heading size="2xl">{burger.name}</Heading>
                                <Table.Root size="sm">
                                    <Table.Body>
                                        {burger.ingredients.map((ingr, ingrIndex) => (
                                            <Table.Row key={ingrIndex}>
                                                <Table.Cell> {ingr.name} </Table.Cell>
                                                <Table.Cell textAlign="end"> {ingr.price}₽ </Table.Cell>
                                            </Table.Row>
                                        ))}
                                        <Table.Row>
                                            <Table.Cell><b>total:</b></Table.Cell>
                                            <Table.Cell textAlign="end"> <b>{burger.price}₽</b></Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table.Root>
                            </div>
                        ))}
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Dialog.ActionTrigger asChild>
                            <Button variant="outline">Cancel</Button>
                        </Dialog.ActionTrigger>
                        <Button>Save</Button>
                    </Dialog.Footer>
                    <Dialog.CloseTrigger asChild>
                        <CloseButton size="sm" />
                    </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
        </Flex>
    )
}

export default Orders;
