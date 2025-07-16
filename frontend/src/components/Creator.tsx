import { Table, List, Button, Flex, CloseButton } from "@chakra-ui/react"
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";


interface Ingredient {
    id: string,
    name: string,
    weight: number,
    price: number,
}

let nextId = 0;

const Creator = () => {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);

    const selectIngredient = (ingredient: Ingredient) => {
    setSelectedIngredients([
            {
                id: ingredient.id + (nextId++).toString(),
                name: ingredient.name,
                weight: ingredient.weight,
                price: ingredient.price,
            },
            ...selectedIngredients,
        ]);
    };

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
        <Flex justify="space-between">
            <List.Root mr="10p">
                {selectedIngredients.map((selectedIngredient) => (
                    <List.Item key={selectedIngredient.id}>
                        <Flex justifyContent="space-between">
                            {selectedIngredient.name}
                            <CloseButton 
                                ml="100px"
                                size="sm"
                                bg="orange.600"
                            >
                            </CloseButton>
                        </Flex>
                    </List.Item>

                ))}
            </List.Root>

            {/* Таблица ингредиентов */} 
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
                            <Button
                                bg="orange.600"
                                onClick={() => selectIngredient(ingredient)}
                            >
                                +
                            </Button>
                        </Table.Cell>
                    </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </Flex>
    );
}

export default Creator;