import { Button, Flex, Image, Input, Text, FileUpload, Table } from "@chakra-ui/react";
import { LuFileImage } from "react-icons/lu"
import Header from "./Header";
import { useAuth } from "../contexts/AuthContext"
import defaultAvatar from "../assets/defaultAvatar.png"
import ConfirmationDialog from "../common/ConfirmationDialog";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {

    const { user } = useAuth();

    const [username, setUsername] = useState(user?.username);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [changeUsernameDialogOpen, setChangeUsernameDialogOpen] = useState(false);


    const checkUsername = async (e: React.FormEvent) => {
        e.preventDefault();
        await axios.get(`http://localhost:8000/users/exists?username=${username}`)
            .catch((error: any) => {
                if (error.status === 404) {
                    //open dialog
                } else {
                    toast.error(`${error.response.data.detail}`);
                }
            })
    }

    const handleSubmit = () => {
        
        console.log();
        setChangeUsernameDialogOpen(false);
    }

    return (
        <Flex bg="#f8ebd7ff" colorPalette="orange" minHeight="100vh" justifyContent="center">
            
            <Header />
            
            <Flex mt="7em" width="60%" bg="orange.200" border="white" borderRadius="2xl" borderStyle="solid">
                
                <ConfirmationDialog 
                    title="test" 
                    dialogOpen={changeUsernameDialogOpen} 
                    handleConfirmation={handleSubmit}
                    handleClose={() => setChangeUsernameDialogOpen(false)}
                />

                <Flex width="100%" margin="3em" justifyContent="space-between">

                    <Flex direction="column">
                        <Image
                            bg="white"
                            w="320px"
                            h="320px"
                            rounded="md"
                            mb="2em"
                            src={defaultAvatar}
                            alt={username}
                        />
                        <FileUpload.Root>
                            <FileUpload.HiddenInput />
                            <FileUpload.Trigger w="100%" bg="orange.400" asChild>
                                <Button variant="outline" size="sm">
                                    <LuFileImage /> Change avatar
                                </Button>
                            </FileUpload.Trigger>
                            <FileUpload.List />
                        </FileUpload.Root>
                    </Flex>

                    <Flex 
                        bg="white"
                        justifyContent="space-between" 
                        h="40%" 
                        w="60%"
                        color="black"
                        rounded="xl"
                        padding="1em"
                    >
                        <Table.Root>
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
                                                borderStyle="solid"
                                                borderColor="orange" 
                                                bg="orange.200" 
                                                value={username}
                                                onChange={(e) => (setUsername(e.target.value), setButtonDisabled(false))}
                                            />
                                            <Button 
                                                bg="orange.400" 
                                                ml="2em"
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
                                        <Text> Number </Text>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <Text> Total spent: </Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text> Number </Text>
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


