import { Flex, Avatar, defineStyle } from "@chakra-ui/react"
import Header from "./Header";
import Menu from './Menu';
import { useAuth } from "../contexts/AuthContext"
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    const ringCss = defineStyle({
    outlineWidth: "2px",
    outlineColor: "colorPalette.500",
    outlineOffset: "2px",
    outlineStyle: "solid",
    })

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
                <Avatar.Root style={{cursor:"pointer"}} css={ringCss} mr="2em">
                    <Avatar.Fallback name="Test" />
                    <Avatar.Image src="https://bit.ly/sage-adebayo" />
                </Avatar.Root>
            </Flex>

            {/* Меню */} 
            <Flex
                mt="100px"
                mb="100px"
                width="100%"
                justify="center"
            >
                <Menu />
            </Flex>
        </Flex>
    )
}

export default Home
