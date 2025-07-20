import { Table, Text, List, Button, Flex, CloseButton, Input, Box, Image, Card } from "@chakra-ui/react"
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";


interface Ingredient {
    id: string,
    name: string,
    weight: number,
    price: number,
}

interface Burger {
    name: string,
    ingredients: Ingredient[],
    weight: number,
    price: number,
}


const Creator = () => {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [burgers, setBurgers] = useState<Burger[]>([]);
    const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
    const [nextId, setNextId] = useState<number>(0);
    const [burgerPrice, setBurgerPrice] = useState<number>(0);
    const [burgerWeight, setBurgerWeight] = useState<number>(0);
    const [burgerName, setBurgerName] = useState("");
    const len = selectedIngredients.length;

    useEffect(() => {
        setBurgerPrice(selectedIngredients.reduce((sum, ingr) => sum + ingr.price, 0));
        setBurgerWeight(selectedIngredients.reduce((sum, ingr) => sum + ingr.weight, 0));
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

    const addToOrder = () => {
        setBurgers([
            {
                name: burgerName,
                ingredients: selectedIngredients,
                weight: burgerWeight,
                price: burgerPrice,
            },
            ...burgers,
        ]);
    }

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
                        rounded="xl"
                        src="https://img.freepik.com/free-photo/delicious-burgers-studio_23-2150902146.jpg?semt=ais_items_boosted&w=740"
                        height="400px"
                        width="400px"
                        alt="BURGA"
                    />
                    <Flex direction="column" width="400px" gap="1em">
                        <Input
                            value={burgerName}
                            onChange={(e) => setBurgerName(e.currentTarget.value)}
                            bg="orange.200"
                            color="black"
                            placeholder="Name your burger!"
                            variant="subtle"
                            >
                        </Input>
                        <Button bg="orange.400" onClick={addToOrder}>
                            Add to order
                        </Button>
                    </Flex>
                </Flex>

                {/* Список добавленных ингредиентов */} 
                <Flex bg="white" rounded="xl" width="25%">
                    <List.Root color="black" mt="1em" ml="auto" mr="auto" fontSize="xl" width="80%">
                        <Text>ingredients: {len}/15</Text>
                        {selectedIngredients.map((selectedIngredient) => (
                            <List.Item key={selectedIngredient.id}>
                                <Flex justifyContent="space-between">
                                    {selectedIngredient.name}
                                    <CloseButton 
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
                </Flex>

                {/* Таблица ингредиентов */} 
                <Flex width="50%">
                    <Table.ScrollArea height="100%" flex="1">
                        <Table.Root
                            bg="orange.200"
                            color="black"
                            variant="outline"
                            size="sm"
                            width=""
                            rounded="xl"
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

            </Flex>
            
            {/* Состав заказа */}
            <Flex mt="1em" width="100%" bg="white" color="black" rounded="xl">
                {burgers.map((burger) => (
                    <Card.Root>
                        <Card.Body>
                            <Card.Title>
                                {burger.name}
                            </Card.Title>
                        </Card.Body>
                    </Card.Root>
                ))}
            </Flex>
            
            <Box mt="1em" color="black">
                <h1>
                    Price: {burgerPrice}, Weight: {burgerWeight}
                </h1>
            </Box>

        </Flex>
    );
}

export default Creator;