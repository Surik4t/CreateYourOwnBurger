import { Flex, Tabs } from "@chakra-ui/react"

const Demo = () => {
    return (
        <Flex
            align="center"
            width="100%"
            padding="rem"
            backgroundColor="Blue"
            justify="center"    
        >
            <Tabs.Root defaultValue="members" variant="plain">
            <Tabs.List bg="red" rounded="l3" p="1">
                <Tabs.Trigger value="members">
                Creator
                </Tabs.Trigger>
                <Tabs.Trigger value="projects">
                Orders
                </Tabs.Trigger>
                <Tabs.Trigger value="tasks">
                About
                </Tabs.Trigger>
                <Tabs.Indicator rounded="l2" />
            </Tabs.List>
            <Tabs.Content value="members">Manage your team members</Tabs.Content>
            <Tabs.Content value="projects">Manage your projects</Tabs.Content>
            <Tabs.Content value="tasks">
                Manage your tasks for freelancers
            </Tabs.Content>
            </Tabs.Root>
        </Flex>
    )
}

export default Demo;