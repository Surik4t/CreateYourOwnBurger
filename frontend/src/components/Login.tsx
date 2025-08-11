import { Flex, Input } from "@chakra-ui/react"
import { ChakraProvider } from "@chakra-ui/react";
import { defaultSystem } from "@chakra-ui/react";

const Login = () => {
    return (
        <ChakraProvider value={defaultSystem}>
            <Flex>
                <Input placeholder="Enter your Username" />
                <Input placeholder="Enter your Password" />
            </Flex>
        </ChakraProvider>
    )
}

export default Login;