import { Flex } from "@chakra-ui/react";
import Header from "./Header";
import Menu from "./Menu";

const Background = () => {
    return (
        <Flex bg="red">

            <Flex
                as="nav"
                align="center"
                justify="space-between"
                bg="gray.400"
                height="100px"
                width="100%"
                position="fixed"
                top="0"
                flexWrap="wrap"
            >
                <Header />
            </Flex>

            <Flex
                bg="blue"
                mt="100px"
                width="100%"
                justify="center"
            >
                <Menu />
            </Flex>
              
        </Flex>
    );
};

export default Background;