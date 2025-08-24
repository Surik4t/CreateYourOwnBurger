import { Flex } from "@chakra-ui/react"
import Header from "./Header";
import Menu from './Menu';
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
