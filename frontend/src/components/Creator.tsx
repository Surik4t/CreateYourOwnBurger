import { List } from "@chakra-ui/react"
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
        <List.Root>
            {ingredients.map((ingredient) => (
                <List.Item key={ingredient.id}>{ingredient.name}</List.Item>
            ))}
        </List.Root>
    );
}

export default Creator;