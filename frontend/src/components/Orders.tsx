import { Flex, Text, Card, CardDescription, CardFooter, Button, Dialog, CloseButton, Table, Heading, Separator, Checkbox } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { format } from "date-fns"
import { useAuth } from "../contexts/AuthContext";
import BurgerInfo from "./BurgerInfo";
import type { CombinedIngredient, Burger, Order } from "../common/types";


interface OrderProps {
    changeTab: (Tab: string) => void,
    handleSetEditOrder: (order: Order) => void,
    menuState: number,
}


const Orders: React.FC<OrderProps> = ({ changeTab, menuState, handleSetEditOrder }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [orderModalOpen, setOrderModalOpen] = useState(false);
    const [burgerModalOpen, setBurgerModalOpen] = useState(false);
    const [selectedBurger, setSelectedBurger] = useState<Burger | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [sendReceiptIsChecked, setSendReceiptIsChecked] = useState(true);
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


    async function getOrders() {
        const response = await api.get(`/orders?customer=${user?.username}`)
            .then(response => setOrders(response.data))
            .catch((error: AxiosError) => console.error(error.message))
    }


    function orderStatusEquals(
        order: Order,
        ...statuses: Array<Order["status"]>
    ): boolean {
        return (statuses.some(status => order.status === status))
    }


    function applyColorToStatus(status: Order["status"]) {
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
        setOrderModalOpen(true);
    }


    const handleCloseBurgerModal = useCallback(() => {
        setBurgerModalOpen(false);
    }, [burgerModalOpen])


    const openBurgerInfo = (burger: Burger) => {
        setSelectedBurger(burger);
        setBurgerModalOpen(true);
    }


    async function changeOrderStatus(order: Order, newStatus=order.status, newDT=order.creation_datetime) {
        const payload = {
            customer: order.customer,
            status: newStatus,
            content: order.content,
            price: order.price,
            weight: order.weight,
            creation_datetime: newDT,
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


    async function sendReceipt(order: Order) {
        const payload = {
            email: user?.email, 
            ...order,
        }
        const url = `http://localhost:8000/orders/email`;
        axios.post(url, payload)
            .then(response => {
                console.log(response.data.message);
            })
            .catch((error: AxiosError) => {
                if (error.response) {
                    console.error("Error status code:", error.response.status);
                    console.error("Details:", error.message);
                }
            });
    } 


    async function ConfirmPayment(order: Order) {
        const currentDT = new Date().toISOString();
        console.log(order);
        await changeOrderStatus(order, "Complete", currentDT);
        if (sendReceiptIsChecked) {
            sendReceipt(order);
        }
        setOrderModalOpen(false);
    }


    async function createOrder(order: Order)  {
        const payload: Order = {
            customer: order.customer,
            status: "Awaiting payment",
            content: order.content,
            price: order.price,
            weight: order.weight,
            creation_datetime: new Date().toISOString(),
        }
        const url = "http://localhost:8000/orders";
        axios.post(url, payload)
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
    }


    useEffect(() => {getOrders()}, [menuState]);

    return (
        <Flex direction="column" rounded="xl" justifySelf="center" width="90%" height="100%">
            
            <BurgerInfo 
                selectedBurger={selectedBurger}
                burgerModalOpen={burgerModalOpen}
                handleCloseBurgerModal={handleCloseBurgerModal}
            />

            <Flex direction="column" width="100%">
                {orders.map((order) => (
                    <Flex key={order.id} margin="0.25em" bg="white" color="black" rounded="xl" height="13em">
                        <Flex padding="1em" direction="column" width="15em">
                            <Text>Order ID:</Text>
                            <Text>{order.id}</Text>
                            <Text>Status: {applyColorToStatus(order.status!)}</Text>
                            <Text>{format(new Date(order.creation_datetime), "yyyy.MM.dd / HH:mm")}</Text>
                            <Text>Total price: <b>{order.price}₽</b></Text>
                            <Flex justifyContent="space-between" mt="1em">
                                <Button onClick={
                                    () => (createOrder(order), getOrders)}
                                    hidden={!orderStatusEquals(order, "Complete", "Canceled")}
                                    bg="orange.400"
                                    >
                                        Reorder <b>⟲</b>
                                </Button>
                                <Button onClick={
                                    () => (editOrder(order), getOrders)}
                                    hidden={!orderStatusEquals(order, "Awaiting payment", "Editing")}
                                    bg="orange.400"
                                    >
                                        Edit
                                </Button>
                                <Button
                                onClick={() => (changeOrderStatus(order, "Canceled"), changeTab("orders"))}
                                hidden={!orderStatusEquals(order, "Awaiting payment", "Editing")}
                                bg="red.400"
                                >
                                    Cancel
                                </Button>
                            </Flex>
                        </Flex>
                        <Flex ml="1em" overflowX="auto" marginEnd="auto">
                            {order.content.map((burger, burgerIndex) => (
                                <Card.Root
                                    className="a"
                                    key={burgerIndex}
                                    bg="orange.200"
                                    colorPalette="orange"
                                    width="175px"
                                    maxHeight="200px"
                                    flexShrink={0}
                                    margin="0.5em"
                                    style={{ cursor:"pointer" }}
                                    _hover={{
                                        outline: "2px solid orange"
                                    }}
                                    onClick={() => openBurgerInfo(burger)}
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
                            onClick={() => openOrderModal(order)}
                            hidden={!orderStatusEquals(order, "Awaiting payment")} 
                            height="150px"
                            width="150px"
                            mt="auto" mb="auto" mr="0.5em"
                            rounded="xl"
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
                open={orderModalOpen}
                motionPreset="scale"
                onOpenChange={(e) => setOrderModalOpen(e.open)}
                >
                <Dialog.Backdrop bg="blackAlpha.600" />
                <Dialog.Positioner>
                    <Dialog.Content color="gray.800">
                    <Dialog.Header>
                        <Dialog.Title color="gray.800">
                            Order confirmation {`- ${selectedOrder &&selectedOrder.id}`}
                        </Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        {selectedOrder && selectedOrder.content.map((burger, burgerIndex) => (
                            <div key={burgerIndex}>
                                <Heading size="xl">{burger.name}</Heading>
                                <Table.Root size="sm">
                                    <Table.Body>
                                        {combineIngredients(burger).map((ingr, ingrIndex) => (
                                            <Table.Row key={ingrIndex}>
                                                <Table.Cell> {ingr.name} </Table.Cell>
                                                <Table.Cell> x{ingr.quantity} </Table.Cell>
                                                <Table.Cell textAlign="end"> {ingr.price}₽ </Table.Cell>
                                            </Table.Row>
                                        ))}
                                        <Table.Row>
                                            <Table.Cell></Table.Cell>
                                            <Table.Cell />
                                            <Table.Cell textAlign="end"> <b>{burger.price}₽</b></Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table.Root>
                            </div>
                        ))}
                        <Separator mb="1em"/>
                        <Flex justifyContent="space-between">
                            <p>Send receipt to your email</p>
                            <Checkbox.Root 
                                defaultChecked 
                                onChange={(e) => setSendReceiptIsChecked(!sendReceiptIsChecked)}
                            >
                                <Checkbox.HiddenInput />
                                    <Checkbox.Control>
                                        <Checkbox.Indicator />
                                    </Checkbox.Control>
                                <Checkbox.Label />
                            </Checkbox.Root>
                        </Flex>
                        <Flex mt="1em" justifyContent="space-between">
                            <Text textStyle="xl" fontWeight="medium">Total: </Text>
                            <Text textStyle="xl" fontWeight="medium">{selectedOrder && selectedOrder!.price}₽</Text>
                        </Flex>
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Dialog.ActionTrigger asChild>
                            <Button bg="orange.400">Cancel</Button>
                        </Dialog.ActionTrigger>
                        <Button
                            onClick={() => ConfirmPayment(selectedOrder!)}
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

export default Orders;
