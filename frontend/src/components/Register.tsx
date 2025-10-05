import { Button, Field, Input, Stack, IconButton, Flex, Text } from "@chakra-ui/react"
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form"
import { useState } from "react"
import { HiEye, HiEyeOff } from "react-icons/hi"
import axios from "axios"
import Header from "./Header"


interface FormValues {
    username: string
    email: string
    password: string
    repeatPassword: string
}

const Register = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<FormValues>()

    const [httpError, setHttpError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showRepeatPassword, setShowRepeatPassword] = useState(false)
    const navigate = useNavigate()

    const togglePasswordVisibility = () => setShowPassword(!showPassword)
    const toggleRepeatPasswordVisibility = () => setShowRepeatPassword(!showRepeatPassword)

    const passwordValue = watch("password")

    const setCookie = (name: string, value: string) => {
        const date = new Date();
        date.setTime(date.getTime() + (1440 * 60 * 1000));
        document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
    };

    const onSubmit = async (data: FormValues) => {
        try {
            setHttpError("");
            setCookie("CYOB_email", data.email);
            const response = await axios.post("http://localhost:8000/users/user_verification", {
                username: data.username,
                email: data.email,
                password: data.password,
                disabled: false,
            });
            console.log(response.data);
            navigate("/confirmation");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // For HTTP errors (4xx, 5xx), the error details are in response.data
                if (error.response) {
                    setHttpError(error.response.data.detail || error.message);
                } else {
                    setHttpError(error.message);
                }
            }
            console.error(error);
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
                    <Field.Root invalid={!!errors.username}>
                        <Field.Label>Username</Field.Label>
                        <Input bg="orange.200" {...register("username", { 
                            required: "Username is required",
                            minLength: { value: 3, message: "Username must be at least 3 characters" }
                        })} />
                        <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.email}>
                        <Field.Label>Email</Field.Label>
                        <Input 
                            bg="orange.200"
                            type="email"
                            {...register("email", { 
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })} 
                        />
                        <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.password}>
                        <Field.Label>Password</Field.Label>
                            <Input 
                                bg="orange.200"
                                type={showPassword ? "text" : "password"} 
                                {...register("password", { 
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Password must be at least 6 characters" }
                                })} 
                                pr="12"
                            />
                            <IconButton
                                bg="orange.400"
                                variant="ghost"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                onClick={togglePasswordVisibility}
                                position="absolute"
                                right="1"
                                
                            >
                                {showPassword ? <HiEye /> : <HiEyeOff />}
                            </IconButton>
                        <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.repeatPassword}>
                        <Field.Label>Repeat Password</Field.Label>
                            <Input 
                                bg="orange.200"
                                type={showRepeatPassword ? "text" : "password"} 
                                {...register("repeatPassword", { 
                                    required: "Please confirm your password",
                                    validate: value => value === passwordValue || "Passwords do not match"
                                })} 
                                pr="12"
                            />
                            <IconButton
                                bg="orange.400"
                                variant="ghost"
                                aria-label={showRepeatPassword ? "Hide password" : "Show password"}
                                onClick={toggleRepeatPasswordVisibility}
                                position="absolute"
                                right="1"
                            >
                                {showRepeatPassword ? <HiEye /> : <HiEyeOff />}
                            </IconButton>
                        <Field.ErrorText>{errors.repeatPassword?.message}</Field.ErrorText>
                    </Field.Root>

                    <Text style={{color: "red"}}> {httpError} </Text>
                    <Button mt="1em" alignSelf="center" bg="orange.400" type="submit">Submit</Button>
                </Stack>
            </form>
        </Flex>
    )
}

export default Register