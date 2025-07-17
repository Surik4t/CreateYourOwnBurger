import { Flex } from "@chakra-ui/react";
import Header from "./Header";
import Menu from "./Menu";

const Background = () => {
    return (
        <Flex bg="#f8ebd7ff" colorPalette="orange">
            {/* Шапка */} 
            <Flex
                as="nav"
                align="center"
                justify="space-between"
                bg="#502212ff"
                height="100px"
                width="100%"
                position="fixed"
                flexWrap="wrap"
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
    );
};

export default Background;