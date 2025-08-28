import { Flex, Avatar, defineStyle, Menu, Portal } from "@chakra-ui/react"
import Header from "./Header";
import { Menu as MainMenu } from './Menu';
import { useAuth } from "../contexts/AuthContext"
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const { isAuthenticated, isLoading, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
            if (!isLoading && !isAuthenticated) {
            navigate('/login');
            }
        }, [isAuthenticated, isLoading, navigate]);

    if (isLoading) return <div>Loading...</div>;
    if (!isAuthenticated) return null;
    
    return (
        <Flex bg="#f8ebd7ff" colorPalette="orange">
            {/* Шапка */} 
            <Flex
                as="nav"
                align="center"
                justify="space-between"
                bg="#502212ff"
                height="75px"
                width="100%"
                position="fixed"
                flexWrap="wrap"
                zIndex="1000"
            >
                <Header />
                <Menu.Root positioning={{ placement: "right-end" }}>
                    <Menu.Trigger mr="2em" rounded="2xl" focusRing="inside" bg="orange.900" >
                        <Avatar.Root size="xl" style={{ cursor:"pointer" }}>
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
                                <Menu.Item onClick={logout} value="logout" py={2} px={4} color="red.500">
                                    Logout
                                </Menu.Item>
                            </Menu.Content>
                        </Menu.Positioner>
                    </Portal>
                </Menu.Root>
            </Flex>

            {/* Меню */} 
            <Flex
                mt="100px"
                mb="100px"
                width="100%"
                justify="center"
            >
                <MainMenu />
            </Flex>
        </Flex>
    )
}

export default Home
