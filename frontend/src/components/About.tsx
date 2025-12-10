import { Flex, Text, Table, Link } from "@chakra-ui/react";

const About = () => {
    return (
        <Flex direction="column" bg="orange.200" border="5px solid white" w="75%" rounded="2xl" justifySelf="center">
            <Flex direction="column" minH="100%" color="black" mb="2em" padding="2em">

                <Text m="1em" textStyle="3xl" textAlign="center">
                    About the <b>"Create Your Own Burger"</b> app.
                </Text>
                <Text mt="1em" textStyle="2xl" textAlign="center">
                    "Create Your Own Burger" is a web application for designing, customizing, and ordering fully personalized burgers, giving you ultimate control over your meal.
                </Text>
    
                <Text mt="2em" mb="1em" textStyle="3xl" textAlign="center">
                    <b>Tech stack:</b>
                </Text>
                
                <Flex alignSelf="center" w="70%" 
                    borderWidth="thick"
                    borderColor="white"
                    borderRadius="2xl"
                >
                    <Table.Root showColumnBorder variant="outline" rounded="xl" border="none">
                        <Table.Body>
                            <Table.Row bg="orange.300">
                                <Table.Cell>
                                    <Text textStyle="2xl">
                                        Backend
                                    </Text>
                                </Table.Cell>
                                <Table.Cell textAlign="end">
                                    <Text textStyle="2xl">
                                        <Link href="https://fastapi.tiangolo.com/">FastAPI</Link>
                                    </Text>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row bg="orange.200">
                                <Table.Cell>
                                    <Text textStyle="2xl">
                                        Frontend
                                    </Text>
                                </Table.Cell>
                                <Table.Cell textAlign="end">
                                    <Text textStyle="2xl">
                                        <Link href="https://react.dev/">React</Link> + <Link href="https://chakra-ui.com/">Chakra UI</Link>
                                    </Text>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row bg="orange.300">
                                <Table.Cell>
                                    <Text textStyle="2xl">
                                        Database
                                    </Text>
                                </Table.Cell>
                                <Table.Cell textAlign="end">
                                    <Text textStyle="2xl">
                                        <Link href="https://www.mongodb.com/">MongoDB</Link>
                                    </Text>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row bg="orange.200">
                                <Table.Cell>
                                    <Text textStyle="2xl">
                                        Message broker
                                    </Text>
                                </Table.Cell>
                                <Table.Cell textAlign="end">
                                    <Text textStyle="2xl">
                                        <Link href="https://www.rabbitmq.com/">RabbitMQ</Link>
                                    </Text>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table.Root>
                </Flex>

                <Text mt="2em" textStyle="2xl" textAlign="center">
                    Check out the <Link href="https://github.com/Surik4t/CreateYourOwnBurger">Source Code!</Link>
                </Text>

                <Text mt="2em" textStyle="2xl" textAlign="center">
                    Thank you for using the app!
                </Text>
                <Text textStyle="2xl" textAlign="center">
                    Got any questions or feedback?
                </Text>
                <Text textStyle="2xl" textAlign="center">
                    Feel free to contact me at <Link href="mailto:Surik4t@yandex.ru?subject=CreateYourOwnBurgerApp">Surik4t@yandex.ru</Link>
                </Text>
            </Flex>
        </Flex>
    )
}

export default About;