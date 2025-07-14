import { Tabs } from "@chakra-ui/react";
import Creator from "./Creator";


const Menu = () => {
    return (
        <Tabs.Root defaultValue="creator" fitted width="75%">
            <Tabs.List p="1">
                <Tabs.Trigger value="creator">
                    Creator
                </Tabs.Trigger>
                <Tabs.Trigger value="orders">
                    Orders
                </Tabs.Trigger>
                <Tabs.Trigger value="about">
                    About
                </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="creator">
                <Creator />
            </Tabs.Content>
            <Tabs.Content value="orders">Previous orders</Tabs.Content>
            <Tabs.Content value="about">About the project</Tabs.Content>
        </Tabs.Root>
    );
};

export default Menu;