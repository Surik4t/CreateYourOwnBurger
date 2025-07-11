
import { Container } from "@chakra-ui/react";
import { defaultSystem } from "@chakra-ui/react";
import { ChakraProvider } from "@chakra-ui/react";
import axios, { AxiosError } from "axios";

interface OrderInterface {
    id: string;
}


async function healthcheck() {
    const url = "http://localhost:8000/healthcheck";
    await axios.get(url)
        .then(response => console.log(response.data.message))
        .catch((error: AxiosError) => {
            if (error.response) {
                console.error("Error status code:", error.response.status);
                console.error("Details:", error.message);
            }
        });
}


export default function Order() {
    healthcheck();
    return (
        <ChakraProvider value={defaultSystem}>
            <Container mt={100}>
                <h1>TEST</h1>
        </Container>
    </ChakraProvider>
    );
}
