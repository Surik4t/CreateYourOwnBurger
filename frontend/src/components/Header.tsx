import { Flex, Heading, Separator } from "@chakra-ui/react";  
  

const Header = () => {
    return (
        <Flex align="center" as="nav">
            <Heading as="h1" size="sm">Create Your Own Burger!</Heading>
        </Flex>
    );
};

export default Header;