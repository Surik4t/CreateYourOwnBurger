import { ChakraProvider, createSystem, defineConfig, defaultConfig } from "@chakra-ui/react";
import { defaultSystem } from "@chakra-ui/react"
import Background from "./components/Background";
import Order from './components/Order';
import Demo from "./components/Creator";

function App() {

    return (
        <ChakraProvider value={defaultSystem}>
            <Background />
        </ChakraProvider>
    )
}

export default App;