import { ChakraProvider } from "@chakra-ui/react";
import { defaultSystem } from "@chakra-ui/react";
import Background from "./components/Background";

function App() {

    return (
        <ChakraProvider value={defaultSystem}>
            <Background />
        </ChakraProvider>
    )
}

export default App;