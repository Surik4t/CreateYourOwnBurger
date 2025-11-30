import { Flex, Text, Card, Button, Dialog, CloseButton, Table, Heading, Separator, Checkbox, Box } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { format } from "date-fns"
import { useAuth } from "../contexts/AuthContext";
import BurgerInfo from "../common/BurgerInfo";
import BurgerImage from "../common/BurgerImage";
import type { CombinedIngredient, Burger, Order } from "../common/types";
import { toast } from "react-toastify";
import ConfirmationDialog from "../common/ConfirmationDialog";


interface OrderProps {
    changeTab: (Tab: string) => void,
    handleSetEditOrder: (order: Order) => void,
    menuState: number,
}


const Orders: React.FC<OrderProps> = ({ changeTab, menuState, handleSetEditOrder }) => {
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [orderModalOpen, setOrderModalOpen] = useState(false);
    const [burgerModalOpen, setBurgerModalOpen] = useState(false);
    const [selectedBurger, setSelectedBurger] = useState<Burger | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [orderForCanceling, setOrderForCancelign] = useState<Order | null>(null);
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
        changeTab("constructor");
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
                existing.price += +(ingr.price.toFixed(2));
            } else {
                map.set(ingr.name, {
                    name: ingr.name,
                    quantity: 1,
                    price: +(ingr.price.toFixed(2))
                });
            }
        });
        return Array.from(map.values());
    };


    async function getOrders() {
        await api.get(`/orders?customer=${user?.username}`)
            .then(response => setOrders(response.data))
            .catch((error: AxiosError) => {
                toast.error(error.message);
                console.error(error.message);
            })
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


    const handleCancelOrder = () => {
        changeOrderStatus(orderForCanceling!, "Canceled");
        changeTab("orders");
        setConfirmationDialogOpen(false);
    }

    const openBurgerInfo = (burger: Burger) => {
        setSelectedBurger(burger);
        setBurgerModalOpen(true);
    }


    async function changeOrderStatus(order: Order, newStatus=order.status, newDT=order.creation_datetime) {
        const payload = {
            customer: order.customer,
            status: newStatus,
            content: order.content,
            price: +(order.price.toFixed(2)),
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
                    toast.error(error.message);
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
                    toast.error(error.message);
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
        toast.success("Thank you for your order!");
    }


    async function createOrder(order: Order)  {
        const payload: Order = {
            customer: order.customer,
            status: "Awaiting payment",
            content: order.content,
            price: +(order.price.toFixed(2)),
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
                    toast.error(error.message);
                    console.error("Error status code:", error.response.status);
                    console.error("Details:", error.message);
                }
            });
    }


    useEffect(() => {getOrders()}, [menuState]);

    return (
        <Flex direction="column" rounded="xl" justifySelf="center" width="90%" height="100%">
            
            <ConfirmationDialog
                dialogOpen={confirmationDialogOpen}
                title={"Do you really want to cancel order " + orderForCanceling?.id}
                handleConfirmation={handleCancelOrder}
                handleClose={() => setConfirmationDialogOpen(false)}
            />

            <BurgerInfo 
                selectedBurger={selectedBurger}
                burgerModalOpen={burgerModalOpen}
                handleCloseBurgerModal={handleCloseBurgerModal}
            />

            <Flex direction="column" width="100%">
                {orders.map((order) => (
                    <Flex key={order.id} margin="0.25em" bg="white" color="black" rounded="xl" height="250px">
                        <Flex padding="1em" direction="column" width="15em">
                            <Text>Order ID:</Text>
                            <Text>{order.id}</Text>
                            <Text>Status: {applyColorToStatus(order.status!)}</Text>
                            <Text>{format(new Date(order.creation_datetime), "yyyy.MM.dd / HH:mm")}</Text>
                            <Text>Total price: <b>${order.price.toFixed(2)}</b></Text>
                            <Flex direction="column" mt="auto">
                                <Button
                                    onClick={() => openOrderModal(order)}
                                    hidden={!orderStatusEquals(order, "Awaiting payment")} 
                                    height="3.2em"
                                    rounded="sm"
                                    mb="0.5em"
                                    bg="green.400"
                                >
                                    <b>Continue to Payment</b>
                                </Button>
                                <Flex justifyContent="space-between">
                                    <Button onClick={
                                        () => (createOrder(order), getOrders)}
                                        hidden={!orderStatusEquals(order, "Complete", "Canceled")}
                                        width="100%"
                                        bg="orange.400"
                                        >
                                            <b>Reorder ⟲</b>
                                    </Button>
                                    <Button onClick={
                                        () => (editOrder(order), getOrders)}
                                        hidden={!orderStatusEquals(order, "Awaiting payment", "Editing")}
                                        width="60%"
                                        bg="orange.400"
                                        >
                                           <b>Edit</b>
                                    </Button>
                                    <Button
                                        onClick={() => (setOrderForCancelign(order), setConfirmationDialogOpen(true))}
                                        hidden={!orderStatusEquals(order, "Awaiting payment", "Editing")}
                                        width="30%"
                                        bg="red.400"
                                    >
                                        <b>Cancel</b>
                                    </Button>
                                </Flex>
                            </Flex>
                        </Flex>
                        <Flex ml="1em" mr="0.5em" overflowX="auto">
                            {order.content.map((burger, burgerIndex) => (
                            <Flex position="relative">
                                <Card.Root
                                    className="a"
                                    key={burgerIndex}
                                    bg="orange.200"
                                    colorPalette="orange"
                                    width="200px"
                                    maxHeight="300px"
                                    flexShrink={0}
                                    margin="0.5em"
                                    style={{ cursor:"pointer" }}
                                    _hover={{
                                        outline: "2px solid orange"
                                    }}
                                    onClick={() => openBurgerInfo(burger)}
                                >
                                    <Box alignSelf="center" position="relative" height="150px" width="50%" overflow="hidden">
                                        <BurgerImage ingredients={burger.ingredients} miniature={true}/>
                                    </Box>
                                    <Card.Body mt="-5">
                                        <Card.Title alignSelf="center">
                                            <Text textStyle="xl" fontWeight="medium" letterSpacing="tight">
                                                {burger.name}
                                            </Text>
                                        </Card.Title>
                                    </Card.Body>
                                </Card.Root>

                                <Box
                                    _hover={{
                                        outline: "0",
                                        border: "none",
                                        boxShadow: "none",
                                        cursor: "default",
                                    }}
                                    bg="orange.400"
                                    rounded="full"
                                    position="absolute"
                                    right="0"
                                    bottom="5px"
                                >                                          
                                    <Text margin="5px" textStyle="lg" fontWeight="medium" color="white">
                                        ${burger.price.toFixed(2)}
                                    </Text>
                                </Box>
                            </Flex>
                            ))}
                        </Flex>
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
                    <Dialog.Body maxHeight="400px" overflowY="auto">
                        {selectedOrder && selectedOrder.content.map((burger, burgerIndex) => (
                            <div key={burgerIndex}>
                                <Heading size="xl">{burger.name}</Heading>
                                <Table.Root size="sm">
                                    <Table.Body>
                                        {combineIngredients(burger).map((ingr, ingrIndex) => (
                                            <Table.Row key={ingrIndex}>
                                                <Table.Cell> {ingr.name} </Table.Cell>
                                                <Table.Cell> x{ingr.quantity} </Table.Cell>
                                                <Table.Cell textAlign="end"> ${ingr.price.toFixed(2)} </Table.Cell>
                                            </Table.Row>
                                        ))}
                                        <Table.Row>
                                            <Table.Cell></Table.Cell>
                                            <Table.Cell />
                                            <Table.Cell textAlign="end"> <b>${burger.price.toFixed(2)}</b></Table.Cell>
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
                                onChange={() => setSendReceiptIsChecked(!sendReceiptIsChecked)}
                            >
                                <Checkbox.HiddenInput />
                                    <Checkbox.Control _hover={{ cursor: "pointer" }}>
                                        <Checkbox.Indicator />
                                    </Checkbox.Control>
                                <Checkbox.Label />
                            </Checkbox.Root>
                        </Flex>
                        <Flex mt="1em" justifyContent="space-between">
                            <Text textStyle="xl" fontWeight="medium">Total: </Text>
                            <Text textStyle="xl" fontWeight="medium">${selectedOrder && selectedOrder!.price.toFixed(2)}</Text>
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
