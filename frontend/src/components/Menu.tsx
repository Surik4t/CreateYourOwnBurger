import { Box, Tabs, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Constructor from "./Constructor";
import Orders from "./Orders";
import About from "./About";
import type { Order } from "../common/types";

export const Menu = () => {

    const [tabValue, setTabValue] = useState<string>(localStorage.getItem("current_tab") || "constructor")
    const [orderInEdit, setOrderInEdit] = useState<Order | null>(null);
    const [menuState, setMenuState] = useState(0);

    const handleTabChange = (Tab: string) => {
        console.log("Redirecting to:", Tab);
        setMenuState(menuState => menuState + 1);
        localStorage.setItem("current_tab", Tab);
        setTabValue(Tab);
    }

    useEffect(() => {
        localStorage.setItem("current_tab", tabValue);
    }, [tabValue])

    return (
        <Box width="75%">
            <Tabs.Root value={tabValue} onValueChange={(e) => setTabValue(e.value)} variant="enclosed" defaultValue="constructor" fitted >
                <Tabs.List bg="transparent" p="1">
                    <Tabs.Trigger rounded="xl" mr="0.5em" color="black" bg="orange.400" value="constructor">
                        <Text textStyle="xl">Constructor</Text>
                    </Tabs.Trigger>
                    <Tabs.Trigger rounded="xl" color="black" bg="orange.400" value="orders">
                        <Text textStyle="xl">Orders</Text>
                    </Tabs.Trigger>
                    <Tabs.Trigger rounded="xl" ml="0.5em" color="black" bg="orange.400" value="about">
                        <Text textStyle="xl">About</Text>
                    </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="constructor"
                    _open={{
                        animationName: "fade-in, scale-in",
                        animationDuration: "300ms",
                    }}
                    _closed={{
                        animationName: "fade-out, scale-out",
                        animationDuration: "120ms",
                    }}
                >
                    <Constructor changeTab={handleTabChange} menuState={menuState} orderInEdit={orderInEdit} />
                </Tabs.Content>
                <Tabs.Content value="orders">
                    <Orders changeTab={handleTabChange} menuState={menuState} handleSetEditOrder={setOrderInEdit}/>
                </Tabs.Content>
                <Tabs.Content value="about"><About/></Tabs.Content>
            </Tabs.Root>
        </Box>
    );
};