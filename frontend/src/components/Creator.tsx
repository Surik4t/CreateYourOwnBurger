import { Table, Text, List, Button, Flex, CloseButton, Input, Box, Image, Card, CardDescription, CardFooter } from "@chakra-ui/react"
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
    const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);    
    const [burgers, setBurgers] = useState<Burger[]>([]);
    const [burgerPrice, setBurgerPrice] = useState<number>(0);
    const [burgerWeight, setBurgerWeight] = useState<number>(0);
    const [burgerName, setBurgerName] = useState("");
    const [nextId, setNextId] = useState<number>(0);
    const len = selectedIngredients.length;

    useEffect(() => {
        setBurgerPrice(selectedIngredients.reduce((sum, ingr) => sum + ingr.price, 0));
        setBurgerWeight(selectedIngredients.reduce((sum, ingr) => sum + ingr.weight, 0));
    }, [selectedIngredients])

    const clearBurgerCreator = () => {
        setSelectedIngredients([]);
        setBurgerName("");
    }

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
    }

    const addToOrder = () => {
        setBurgers([
            {
                name: burgerName || "Custom Burger",
                ingredients: selectedIngredients,
                weight: burgerWeight,
                price: burgerPrice,
            },
            ...burgers,
        ]);
        clearBurgerCreator();
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
                    <List.Root
                        color="black"
                        ml="auto" mr="auto"
                        fontSize="xl"
                        width="80%"
                        >
                        <Text textStyle="2xl">Ingredients: {len}/15</Text>
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
            <Flex mt="1em" width="100%" bg="white" color="black" rounded="xl" overflowX="auto">
                {burgers.map((burger) => (
                    <Card.Root
                        bg="orange.200"
                        colorPalette="orange"
                        minWidth="15%"
                        maxWidth="15%"
                        flexShrink={0}
                        margin="0.5em"
                        >
                        <Card.Body>
                            <Card.Title>
                                {burger.name}
                            </Card.Title>
                            <CardDescription>
                                {burger.ingredients.map(ingr => ingr.name).join(", ")}
                            </CardDescription>
                        </Card.Body>
                        <CardFooter>
                            <Text textStyle="2xl" fontWeight="medium" letterSpacing="tight" mt="2">
                                {burger.price}₽
                            </Text>
                        </CardFooter>
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