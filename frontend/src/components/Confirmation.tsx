import { Button, Field, Input, Stack, Flex } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import Header from "./Header"

interface FormValues {
    confirmationCode: string;
}

const Confirmation = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>()

    const navigate = useNavigate();

    function get_cookie(name: string) {
        let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) return match[2];
    }

    const onSubmit = async (data: FormValues) => {
        try {
            const email = get_cookie("CYOB_email");
            const response = await axios.post("http://localhost:8000/users/code_confirmation", {
                confirmation_code: data.confirmationCode,
                email: email,
            });
            console.log("Registration successful:", response.data);
            navigate("/login");
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };
    return (
        <Flex bg="#f8ebd7ff" direction="column" colorPalette="orange" minHeight="100vh">
            <Flex
                as="nav"
                align="center"
                justify="space-between"
                bg="#502212ff"
                height="75px"
                width="100%"
                position="fixed"
                flexWrap="wrap"
                zIndex="1000"
            >
                <Header />
            </Flex>
            <Flex mt="200px"/>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack
                    bg="white" 
                    color="black"
                    gap="1em"
                    align="flex-start"
                    width="30em"
                    justifySelf="center"
                    padding="2em"
                    rounded="2xl"
                >
                    <Field.Root invalid={!!errors.confirmationCode}>
                        <Field.Label>Confirmation Code</Field.Label>
                        <Input bg="orange.200" {...register("confirmationCode", { 
                            required: "Enter confirmation code.",
                        })} />
                        <Field.ErrorText>{errors.confirmationCode?.message}</Field.ErrorText>
                    </Field.Root>

                    <Button mt="1em" alignSelf="center" bg="orange.400" type="submit">Submit</Button>
                </Stack>
            </form>
        </Flex>
    )
}

export default Confirmation;