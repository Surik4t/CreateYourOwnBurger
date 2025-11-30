import { Flex } from "@chakra-ui/react"
import Header from "./Header";
import { Menu as MainMenu } from './Menu';


function Home() {
    
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
