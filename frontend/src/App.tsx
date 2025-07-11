import { ChakraProvider } from "@chakra-ui/react";
import { defaultSystem } from "@chakra-ui/react"
import Header from "./components/Header";
import Order from './components/Order';

function App() {

  return (
    <ChakraProvider value={defaultSystem}>
      <Header />
      <Order /> 
    </ChakraProvider>
  )
}

export default App;