import { Table, Button } from "@chakra-ui/react"
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";


interface Ingredient {
    id: string,
    name: string,
    weight: number,
    price: number,
}


const Creator = () => {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);

    useEffect(() => {get_ingredients(), healthcheck()}, []);

    async function get_ingredients() {
        const url = "http://localhost:8000/ingredients/";
        await axios.get(url)
            .then(response => setIngredients(response.data))
            .catch((error: AxiosError) => console.error(error.message))    
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
   
   
    return (
        <Table.Root
            bg="orange"
            color="black"
            variant="outline"
            size="sm"
            maxWidth="50%"
        >
            <Table.Header bg="orange.600">
                <Table.Row>
                    <Table.ColumnHeader>Ingredient</Table.ColumnHeader>
                    <Table.ColumnHeader>Price</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end">Add</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {ingredients.map((ingredient) => (
                <Table.Row key={ingredient.id}>
                    <Table.Cell>{ingredient.name}</Table.Cell>
                    <Table.Cell>{ingredient.price}</Table.Cell>
                    <Table.Cell textAlign="end">
                        <Button bg="orange.600"
                        >
                            +
                        </Button>
                    </Table.Cell>
                </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>

        /*
        <List.Root>
            {ingredients.map((ingredient) => (
                <List.Item key={ingredient.id}>{ingredient.name}</List.Item>
            ))}
        </List.Root>
        */
    );
}

export default Creator;