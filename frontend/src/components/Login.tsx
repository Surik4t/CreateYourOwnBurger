import { Button, Field, Input, Stack, IconButton, Text } from "@chakra-ui/react"
import { HiEye, HiEyeOff } from "react-icons/hi"
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from "react-hook-form"
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

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
        setError("");

        try {
            const response = await axios.post(
                "http://localhost:8000/users/token",
                {
                    username: data.username,
                    password: data.password,
                },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },                
                }
            );
            await login(response.data.access_token);
            navigate("/"); 
        } catch (err) {
            setError(
                axios.isAxiosError(err) 
                ? err.response?.data?.detail || 'Invalid email or password'
                : 'Login failed'
            );
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="4" align="flex-start" maxW="sm">

                <Field.Root invalid={!!errors.username}>
                    <Field.Label>Username</Field.Label>
                    <Input {...register("username", { 
                        required: "Username is required",
                        minLength: { value: 3, message: "Username must be at least 3 characters" }
                    })} />
                    <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!errors.password}>
                    <Field.Label>Password</Field.Label>
                        <Input 
                            type={showPassword ? "text" : "password"} 
                            {...register("password", { 
                                required: "Password is required",
                                minLength: { value: 6, message: "Password must be at least 6 characters" }
                            })} 
                            pr="12"
                        />
                        <IconButton
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
                
                <Text color="red">{error}</Text>

                <Button type="submit">Submit</Button>
                
                <Link to="/register">Sign up</Link>

            </Stack>
        </form>

    );
};

export default Login;