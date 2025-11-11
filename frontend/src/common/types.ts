export interface Ingredient {
    name: string,
    weight: number,
    price: number,
}

export interface CombinedIngredient {
    name: string,
    quantity: number,
    price: number,
}

export interface Burger {
    name: string,
    ingredients: Ingredient[],
    weight: number,
    price: number,
}

export interface Order {
    id?: string,
    customer: string,
    status?: "Awaiting payment" | "Editing" | "Canceled" | "Complete"
    content: Burger[],
    price: number,
    weight: number,
    creation_datetime: string,
}