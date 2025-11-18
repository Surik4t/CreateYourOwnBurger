import { Button, Flex, Image, Input, Text, FileUpload, Table, type FileUploadFileAcceptDetails, type FileUploadFileRejectDetails } from "@chakra-ui/react";
import { LuFileImage } from "react-icons/lu"
import Header from "./Header";
import { useAuth } from "../contexts/AuthContext"
import ConfirmationDialog from "../common/ConfirmationDialog";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {

    const { user } = useAuth();

    const [username, setUsername] = useState(user?.username);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [changeUsernameDialogOpen, setChangeUsernameDialogOpen] = useState(false);
    const [avatarUpdateCount, setAvatarUpdateCount] = useState(0);


    const checkUsername = async (e: React.FormEvent) => {
        e.preventDefault();
        await axios.get(`http://localhost:8000/users/exists?username=${username}`)
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
        axios.put(`http://localhost:8000/users?username=${user?.username}`, payload)
            .then((response) => {
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
            axios.post(`http://localhost:8000/users/profilepic?username=${user?.username}`, formData)
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
            
            <Flex mt="7em" width="60%" bg="orange.200" border="white" borderRadius="2xl" borderStyle="solid">
                
                <ConfirmationDialog 
                    title={"Do you want to change your username to " + username + "?"} 
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
                                <Button variant="outline" size="sm">
                                    <LuFileImage /> Change avatar
                                </Button>
                            </FileUpload.Trigger>
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


