import { ChakraProvider } from '@chakra-ui/react'
import { defaultSystem } from "@chakra-ui/react"
import Header from "./components/Header";

function App() {

  return (
    <ChakraProvider value={defaultSystem}>
      <Header />
    </ChakraProvider>
  )
}

export default App;