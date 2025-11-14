import { Button, Flex, Image, Input, Text, FileUpload } from "@chakra-ui/react";
import { LuFileImage } from "react-icons/lu"
import Header from "./Header";
import { useAuth } from "../contexts/AuthContext"
import defaultAvatar from "../assets/defaultAvatar.png"


const Profile = () => {

    const { user } = useAuth();

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
                        padding="1em"
                        justifyContent="space-between" 
                        h="15%" 
                        w="60%"
                        rounded="xl"
                        color="black"
                    >
                        <Flex direction="column" w="20%" justifyContent="space-between">
                            <Text> Username: </Text>
                            <Text> Email: </Text>
                        </Flex>
                        <Flex direction="column" w="80%" justifyContent="space-between">
                            <Flex >
                                <Input 
                                    borderStyle="solid"
                                    borderColor="orange" 
                                    bg="orange.200" 
                                    placeholder={user?.username} 
                                />
                                <Button bg="orange.400" ml="2em">Change</Button>
                            </Flex>
                            <Flex>
                                <Text> {user?.email} </Text>
                            </Flex>
                        </Flex>
                        
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default Profile;


