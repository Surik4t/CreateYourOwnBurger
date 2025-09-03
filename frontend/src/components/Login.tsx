import { Button, Field, Input, Stack, IconButton, Text, Flex } from "@chakra-ui/react"
import { HiEye, HiEyeOff } from "react-icons/hi"
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from "react-hook-form"
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import Header from "./Header";

interface FormValues {
    username: string
    password: string
}

export const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>()

    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const togglePasswordVisibility = () => setShowPassword(!showPassword)

    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data: FormValues) => {
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post(
                "http://localhost:8000/users/token",
                {
                    username: data.username,
                    password: data.password,
                },
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    timeout: 5000
                }
            );
            await login(response.data.access_token);
            navigate("/"); 
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response) {
                    setError(err.response?.data?.detail);
                } else if (err.code === "ECONNABORTED" || err.request) {
                    setError("Server is not responding. Please try again later.");
                } else {
                    setError("An unexpected error occurred");
                }
            } else {
                setError("Login failed");
            }
        } finally {
            setIsLoading(false);
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
            <Flex mt="300px"/>
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
                        <Input bg="orange.200"
                            {...register("username", { 
                                required: "Username is required",
                                minLength: { value: 3, message: "Username must be at least 3 characters" }
                        })} />
                        <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.password}>
                        <Field.Label>Password</Field.Label>
                            <Input bg="orange.200"
                                type={showPassword ? "text" : "password"} 
                                {...register("password", { 
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Password must be at least 6 characters" }
                                })} 
                                pr="12"
                            />
                            <IconButton
                                variant="ghost"
                                bg="orange.400"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                onClick={togglePasswordVisibility}
                                position="absolute"
                                right="1"
                            >
                                {showPassword ? <HiEye /> : <HiEyeOff />}
                            </IconButton>
                        <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                    </Field.Root>
                    
                    <Text color="red">{error}</Text>

                    <Flex width="100%" direction="column" justify="center" align="center" gap="1em"> 
                        <Button bg="orange.400" type="submit" loading={isLoading}>
                            {isLoading ? "Logging in..." : "Submit"}
                        </Button>
                        
                        <Link to="/register">Sign up</Link>
                    </Flex>


                </Stack>
            </form>
        </Flex>
    );
};

export default Login;