import { Flex, Button, Dialog, CloseButton, Table, Heading, Menu, Avatar, Portal } from "@chakra-ui/react";
import { useState } from "react";

const Test = () => {
    const [modalOpen, setModalOpen] = useState(false);

    const openOrderModal = () => {
        setModalOpen(true);
    }

    return (
        <Flex bg="white">
            <Menu.Root positioning={{ placement: "right-end" }}>
                <Menu.Trigger
                    margin="10em"
                    mr="2em"
                    rounded="full"
                >   
                    <Avatar.Root
                        size="xl" 
                        style={{ cursor:"pointer" }}
                    >
                        <Avatar.Fallback name="Segun Adebayo" />
                        <Avatar.Image src="https://bit.ly/sage-adebayo" />
                    </Avatar.Root>

                </Menu.Trigger>
                <Portal>
                    <Menu.Positioner>
                        <Menu.Content>
                            <Menu.Item value="profile" py={2} px={4}>
                                Profile
                            </Menu.Item>
                            <Menu.Item value="settings" py={2} px={4}>
                                Settings
                            </Menu.Item>
                            <Menu.Separator />
                            <Menu.Item value="logout" py={2} px={4} color="red.500">
                                Logout
                            </Menu.Item>
                        </Menu.Content>
                    </Menu.Positioner>
                </Portal>
            </Menu.Root>

            <Menu.Root positioning={{ placement: "right-end" }}>
                <Menu.Trigger rounded="full" focusRing="outside">
                    <Avatar.Root size="xl">
                        <Avatar.Fallback name="Segun Adebayo" />
                        <Avatar.Image src="https://bit.ly/sage-adebayo" />
                    </Avatar.Root>
                </Menu.Trigger>
                <Portal>
                    <Menu.Positioner>
                        <Menu.Content>
                            <Menu.Item value="account">Account</Menu.Item>
                            <Menu.Item value="settings">Settings</Menu.Item>
                            <Menu.Item value="logout">Logout</Menu.Item>
                        </Menu.Content>
                    </Menu.Positioner>
                </Portal>
            </Menu.Root>
        </Flex>
    )
}

export default Test;