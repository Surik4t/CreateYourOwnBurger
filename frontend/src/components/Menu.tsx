import { Tabs } from "@chakra-ui/react";
import { useState } from "react";
import Creator from "./Creator";
import Orders from "./Orders";

interface Ingredient {
    index: number,
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

interface Order {
    customer: string,
    status: string,
    content: Burger[],
    price: number,
    weight: number,
    creation_datetime: string,
}

const Menu = () => {

    const [tabValue, setTabValue] = useState<string | null>("creator")
    const [orderInEdit, setOrderInEdit] = useState<Order | null>(null);
    const [menuState, setMenuState] = useState(0);

    const handleTabChange = (Tab: string) => {
        console.log("Redirecting to:", Tab);
        setMenuState(menuState => menuState + 1);
        setTabValue(Tab);
    }

    return (
        <Tabs.Root value={tabValue} onValueChange={(e) => setTabValue(e.value)} variant="line" defaultValue="creator" fitted width="75%">
            <Tabs.List bg="orange.400" p="1" rounded="xl">
                <Tabs.Trigger color="black" bg="orange.400" value="creator">
                    Creator
                </Tabs.Trigger>
                <Tabs.Trigger color="black" bg="orange.400" value="orders">
                    Orders
                </Tabs.Trigger>
                <Tabs.Trigger color="black" bg="orange.400" value="about">
                    About
                </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="creator"
            _open={{
                animationName: "fade-in, scale-in",
                animationDuration: "300ms",
            }}
            _closed={{
                animationName: "fade-out, scale-out",
                animationDuration: "120ms",
            }}
            >
                <Creator changeTab={handleTabChange} menuState={menuState} orderInEdit={orderInEdit} />
            </Tabs.Content>
            <Tabs.Content value="orders">
                <Orders changeTab={handleTabChange} menuState={menuState} handleSetEditOrder={setOrderInEdit}/>
            </Tabs.Content>
            <Tabs.Content value="about">About the project</Tabs.Content>
        </Tabs.Root>
    );
};

export default Menu;