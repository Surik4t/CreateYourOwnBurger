import { Tabs } from "@chakra-ui/react";
import Creator from "./Creator";
import Orders from "./Orders";


const Menu = () => {
    return (
        <Tabs.Root variant="line" defaultValue="creator" fitted width="75%">
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
                <Creator />
            </Tabs.Content>
            <Tabs.Content value="orders">
                <Orders />
            </Tabs.Content>
            <Tabs.Content value="about">About the project</Tabs.Content>
        </Tabs.Root>
    );
};

export default Menu;