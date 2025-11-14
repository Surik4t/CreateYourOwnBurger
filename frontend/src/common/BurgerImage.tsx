import { Flex, Image } from "@chakra-ui/react";
import bottomBun from '../assets/bottom-bun.png'
import beefpatty from '../assets/beef-patty.png'
import cheese from '../assets/cheese.png'
import ketchup from '../assets/ketchup.png'
import mayo from '../assets/mayo.png'
import lettuce from '../assets/lettuce.png'
import mustard from '../assets/mustard.png'
import tomato from '../assets/tomato.png'
import pickles from '../assets/pickles.png'
import type { Ingredient } from "../common/types";
 
interface BurgerImageProps {
    ingredients: Array<Ingredient>,
    miniature: boolean,
} 

const BurgerImage: React.FC<BurgerImageProps> = ({ ingredients, miniature }) => {

    const ingredientImages: Record<string, string> = {
        "Bun": bottomBun,
        "Beef Patty": beefpatty,
        "Cheese": cheese,
        "Ketchup": ketchup,
        "Mayo": mayo,
        "Lettuce": lettuce,
        "Mustard": mustard,
        "Tomato Slice": tomato,
        "Pickles": pickles
    };

    const getIngredientHeight = (ingredient: string, miniature=true) => {
        const sauces = ["Ketchup", "Mayo", "Mustard"]
        const slices = ["Cheese", "Tomato Slice", "Pickles"]
        const meat = ["Beef Patty"]

        let result = 35;

        if (sauces.includes(ingredient)) {
            result = 5;
        } else if (slices.includes(ingredient)) {
            result = 15;
        } else if (meat.includes(ingredient)) {
            result = 10;
        }

        if (miniature) {
            return result/2.5
        } else {
            return result
        }
    }

    return (
        <Flex height="100%" width="100%" justifyContent="center">
            {ingredients.map((item, index) => {
                const accumulatedHeight = ingredients
                    .slice(0, index)
                    .reduce((total, ingredient) => total + getIngredientHeight(ingredient.name, miniature), 0);
                return (
                    <Image
                        key={index} 
                        zIndex={index} 
                        src={ingredientImages[item.name]}
                        bottom={`${accumulatedHeight}px`}
                        position="absolute"
                    />
                )
            })}
        </Flex>
    )
}

export default BurgerImage;


