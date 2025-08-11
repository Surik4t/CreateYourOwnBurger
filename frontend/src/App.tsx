import { Flex } from '@chakra-ui/react';
import { ChakraProvider } from "@chakra-ui/react";
import { defaultSystem } from "@chakra-ui/react";
import Header from './components/Header';
import Menu from './components/Menu';

function App() {

    return (
        <ChakraProvider value={defaultSystem}>
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
        </ChakraProvider>
    )
}

export default App;