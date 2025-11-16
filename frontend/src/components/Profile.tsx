import { Button, Flex, Image, Input, Text, FileUpload, Table } from "@chakra-ui/react";
import { LuFileImage } from "react-icons/lu"
import Header from "./Header";
import { useAuth } from "../contexts/AuthContext"
import defaultAvatar from "../assets/defaultAvatar.png"


const Profile = () => {

    const { user } = useAuth();

    const handleSubmit = () => {

    }

    return (
        <Flex bg="#f8ebd7ff" colorPalette="orange" minHeight="100vh" justifyContent="center">
            <Header />
            <Flex mt="7em" width="60%" bg="orange.200" border="white" borderRadius="2xl" borderStyle="solid">
                <Flex width="100%" margin="3em" justifyContent="space-between">

                    <Flex direction="column">
                        <Image
                            bg="white"
                            w="320px"
                            h="320px"
                            rounded="md"
                            mb="2em"
                            src={defaultAvatar}
                            alt={user?.username}
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
                        mb="1em"
                    >
                        <Table.Root>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell>
                                        <Text> Username: </Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Input 
                                            w="70%"
                                            borderStyle="solid"
                                            borderColor="orange" 
                                            bg="orange.200" 
                                            placeholder={user?.username} 
                                        />
                                        <Button bg="orange.400" ml="2em">Change</Button>
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


