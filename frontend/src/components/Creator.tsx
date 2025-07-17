import { Table, List, Button, Flex, CloseButton, Input, Box, Image } from "@chakra-ui/react"
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
    const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
    const [nextId, setNextId] = useState<number>(0);
    const [orderPrice, setOrderPrice] = useState<number>(0);
    const [orderWeight, setOrderWeight] = useState<number>(0);
    const len = selectedIngredients.length;

    useEffect(() => {
        setOrderPrice(selectedIngredients.reduce((sum, ingr) => sum + ingr.price, 0));
        setOrderWeight(selectedIngredients.reduce((sum, ingr) => sum + ingr.weight, 0));
    }, [selectedIngredients])


    const selectIngredient = (ingredient: Ingredient) => {
    setSelectedIngredients([
            {
                id: nextId.toString(),
                name: ingredient.name,
                weight: ingredient.weight,
                price: ingredient.price,
            },
            ...selectedIngredients,
        ]);
        setNextId(nextId + 1);
    };

    useEffect(() => {get_ingredients(), healthcheck()}, []);

    async function get_ingredients() {
        const url = "http://localhost:8000/ingredients";
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
        <Flex wrap="wrap">
            <Flex minWidth="100%" justifyContent="space-between" gap="2em" >

                {/* Динамическая иллюстрация бургера */}
                <Flex direction="column" gap="1em">
                    <Image
                        rounded="md" 
                        src="https://img.freepik.com/free-photo/delicious-burgers-studio_23-2150902146.jpg?semt=ais_items_boosted&w=740"
                        height="400px"
                        width="400px"
                        alt="BURGA"
                    />
                    <Flex direction="column" width="400px" gap="1em">
                        <Input
                            bg="orange.200"
                            color="black"
                            placeholder="Name your burger!"
                            variant="subtle"
                            >
                        </Input>
                        <Button bg="orange.400">
                            Add to order
                        </Button>
                    </Flex>
                </Flex>

                {/* Список добавленных ингредиентов */} 
                <List.Root color="black" mr="10p">
                    {selectedIngredients.map((selectedIngredient) => (
                        <List.Item key={selectedIngredient.id}>
                            <Flex justifyContent="space-between">
                                {selectedIngredient.name}
                                <CloseButton 
                                    ml="100px"
                                    size="2xs"
                                    bg="orange.400"
                                    onClick={() => 
                                        setSelectedIngredients(
                                            selectedIngredients.filter(ingr =>
                                                ingr.id !== selectedIngredient.id
                                            ))}
                                >
                                </CloseButton>
                            </Flex>
                        </List.Item>
                    ))}
                </List.Root>

                {/* Таблица ингредиентов */} 
                <Table.ScrollArea width="50%" height="25rem">
                    <Table.Root
                        bg="orange.200"
                        color="black"
                        variant="outline"
                        size="sm"
                        stickyHeader
                    >
                        <Table.Header bg="orange.400">
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
                                        bg="orange.400"
                                        onClick={() => selectIngredient(ingredient)}
                                    >
                                        +
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Table.ScrollArea>

            </Flex>

            <Box mt="1em" color="black">
                <h1>
                    Total price: {orderPrice}, Weight: {orderWeight}, len: {len}
                </h1>
            </Box>

        </Flex>
    );
}

export default Creator;