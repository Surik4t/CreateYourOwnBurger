import { Flex } from "@chakra-ui/react"
import Header from "./Header";
import { Menu as MainMenu } from './Menu';
import { useAuth } from "../contexts/AuthContext"
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
            if (!isLoading && !isAuthenticated) {
                navigate('/login');
            }
        }, [isAuthenticated, isLoading, navigate]);

    if (isLoading) return <div>Loading...</div>;
    if (!isAuthenticated) return null;
    
    return (
        <Flex bg="#f8ebd7ff" colorPalette="orange" minHeight="100vh">
            <Header />
            <Flex
                mt="70px"
                mb="75px"
                width="100%"
                justify="center"
            >
                <MainMenu />
            </Flex>
        </Flex>
    )
}

export default Home
