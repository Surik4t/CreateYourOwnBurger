import { Flex, Heading, Menu, Avatar, Portal } from "@chakra-ui/react";  
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext"


const Header = () => {

    const navigate = useNavigate();
    const { logout, user } = useAuth();

    return (
            <Flex
                as="nav"
                align="center"
                justify="space-between"
                bg="#502212ff"
                height="55px"
                width="100%"
                position="fixed"
                flexWrap="wrap"
                zIndex="1000"
            >
            <Heading 
                ml="1em" 
                size="3xl"
                style={{cursor: "pointer"}}
                onClick={() => navigate("/")}
            >
                Create Your Own Burger!
            </Heading>

            <Menu.Root>
                <Menu.Trigger rounded="full" mr="2em">   
                    <Avatar.Root size="lg" style={{ cursor:"pointer" }}>
                        <Avatar.Fallback name={user?.username} />
                        <Avatar.Image src={`/profile_pics/${user?.profile_pic}`} />
                    </Avatar.Root>
                </Menu.Trigger>
                <Portal>
                    <Menu.Positioner>
                        <Menu.Content>
                            <Menu.Item onClick={() => navigate("/profile")} value="profile" py={2} px={4} style={{ cursor:"pointer" }}>
                                Profile
                            </Menu.Item>
                            <Menu.Separator />
                            <Menu.Item onClick={logout} value="logout" py={2} px={4} color="red.500" style={{ cursor:"pointer" }}>
                                Logout
                            </Menu.Item>
                        </Menu.Content>
                    </Menu.Positioner>
                </Portal>
            </Menu.Root>
        </Flex>
    );
};

export default Header;