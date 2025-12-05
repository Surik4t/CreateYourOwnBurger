import { Button, Flex, Image, Input, Text, FileUpload, Table, type FileUploadFileAcceptDetails, type FileUploadFileRejectDetails } from "@chakra-ui/react";
import { LuFileImage } from "react-icons/lu"
import Header from "./Header";
import { useAuth } from "../contexts/AuthContext"
import ConfirmationDialog from "../common/ConfirmationDialog";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import type { Order } from "../common/types";
import { get_api_base } from "../common/API";

const Profile = () => {

    const { user, login } = useAuth();

    const [username, setUsername] = useState(user?.username);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [changeUsernameDialogOpen, setChangeUsernameDialogOpen] = useState(false);
    const [avatarUpdateCount, setAvatarUpdateCount] = useState(0);
    const [completeOrders, setCompleteOrders] = useState<Order[]>([]);
    const token = localStorage.getItem('access_token');

    const api = get_api_base(token || "")

    const getCompleteOrders = async () => {
        await api.get(`/orders?customer=${user?.username}`)
            .then(response => {
                let orders: Order[] = response.data;
                setCompleteOrders(orders.filter((order: Order) => order.status === "Complete"))
            })
            .catch((error: AxiosError) => {
                toast.error(error.message);
                console.error(error.message);
            })
        }
    
    const calculateTotalSpent = () => {
        let total = 0;
        completeOrders.map(order => {
            total += order.price;
        })
        return total.toFixed(2);
    } 

    useEffect(() => {getCompleteOrders()}, []);


    const checkUsername = async (e: React.FormEvent) => {
        e.preventDefault();
        await api.get(`/users/exists?username=${username}`)
            .catch((error: any) => {
                if (error.status === 404) {
                    setChangeUsernameDialogOpen(true);
                } else {
                    toast.error(`${error.response.data.detail}`);
                }
            })
    }

    const handleSubmit = () => {
        setChangeUsernameDialogOpen(false);
        const payload = {
            new_username: username,
        }
        api.put(`/users?username=${user?.username}`, payload)
            .then((response) => {
                login(response.data.access_token);
                setButtonDisabled(true);
                toast.info(response.data.message);
            })
            .catch((error: any) => {
                toast.error(error.response.data.detail);
            })
    }

    const handleFileAccept = (fileDetails: FileUploadFileAcceptDetails) => {
        console.log(fileDetails);
        const file = fileDetails.files[0];
        if (file) {
            console.log(file);
            let formData = new FormData();
            formData.append("image", file);
            api.post(`/users/profilepic?username=${user?.username}`, formData)
                .then((response) => {
                    toast.info(response.data.message);
                    setAvatarUpdateCount(avatarUpdateCount + 1);
                    fileDetails.files.pop();
                })
                .catch((error: any) => {
                    toast.error(error.response.data.detail);
                    fileDetails.files.pop();
                })
        } else {
            toast.error("Error uploading file.");
        }
    }

    const handleFileReject = (fileDetails: FileUploadFileRejectDetails) => {
        fileDetails.files.pop();
        toast.warn("File must be an image with a maximum size of 20 MB");
    }



    return (
        <Flex bg="#f8ebd7ff" colorPalette="orange" minHeight="100vh" justifyContent="center">
            
            <Header />
            
            <Flex 
                mt="7em" width="60%" 
                bg="orange.200" 
                border="5px solid white"
                borderRadius="xl"
            >
                
                <ConfirmationDialog 
                    title={"Do you want to change your username to " + username + "?"} 
                    dialogOpen={changeUsernameDialogOpen} 
                    handleConfirmation={handleSubmit}
                    handleClose={() => setChangeUsernameDialogOpen(false)}
                />

                <Flex width="100%" margin="3em" justifyContent="space-between">

                    <Flex direction="column">
                        <Image
                            w="320px"
                            h="320px"
                            border="5px solid white"
                            borderRadius="xl"
                            mb="2em"
                            key={avatarUpdateCount}
                            src={`/profile_pics/${user?.profile_pic}?v=${avatarUpdateCount}`}
                            alt={username}
                        />
                        <FileUpload.Root
                            accept={["image/png", "image/jpeg", "image/bmp"]}
                            maxFiles={1}
                            maxFileSize={20000000}
                            onFileAccept={handleFileAccept}
                            onFileReject={handleFileReject}
                        >
                            <FileUpload.HiddenInput />
                            <FileUpload.Trigger w="100%" bg="orange.400" asChild>
                                <Button 
                                    variant="outline" size="xl"
                                    border="5px solid white"
                                    borderRadius="xl"
                                >
                                    <LuFileImage /> Change avatar
                                </Button>
                            </FileUpload.Trigger>
                        </FileUpload.Root>
                    </Flex>

                    <Flex 
                        //bg="white"
                        justifyContent="space-between" 
                        h="40%" 
                        w="60%"
                        color="black"
                        rounded="xl"
                        padding="1em"
                    >
                        <Table.Root overflow="hidden" rounded="xl">
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell>
                                        <Text> Username: </Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <form onSubmit={checkUsername}>
                                            <Input 
                                                name="username"
                                                w="70%"
                                                border="3px solid orange"
                                                borderRadius="xl" 
                                                bg="orange.200" 
                                                value={username}
                                                onChange={(e) => (setUsername(e.target.value), setButtonDisabled(false))}
                                            />
                                            <Button 
                                                bg="orange.400" 
                                                ml="2em"
                                                rounded="xl"
                                                type="submit"
                                                disabled={buttonDisabled}
                                            >
                                                Change
                                            </Button>
                                        </form>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <Text> Email: </Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text> {user?.email} </Text>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <Text> Complete orders: </Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text> {completeOrders.length} </Text>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <Text> Total spent: </Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text> ${calculateTotalSpent()} </Text>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table.Root>
                    
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default Profile;


