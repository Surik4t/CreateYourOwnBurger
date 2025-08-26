import { Button, Field, Input, Stack, IconButton } from "@chakra-ui/react"
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form"
import { useState } from "react"
import { HiEye, HiEyeOff } from "react-icons/hi"
import axios from "axios"


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

    const [showPassword, setShowPassword] = useState(false)
    const [showRepeatPassword, setShowRepeatPassword] = useState(false)
    const navigate = useNavigate()

    const togglePasswordVisibility = () => setShowPassword(!showPassword)
    const toggleRepeatPasswordVisibility = () => setShowRepeatPassword(!showRepeatPassword)

    const passwordValue = watch("password")

    const onSubmit = async (data: FormValues) => {
        try {
            const response = await axios.post("http://localhost:8000/users/", {
                username: data.username,
                email: data.email,
                password: data.password,
                disabled: false,
            });
            console.log("Registration successful:", response.data);
            navigate("/login");
        } catch (error) {
            console.error("Registration failed:", error);
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

                <Field.Root invalid={!!errors.email}>
                    <Field.Label>Email</Field.Label>
                    <Input 
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

                <Field.Root invalid={!!errors.repeatPassword}>
                    <Field.Label>Repeat Password</Field.Label>
                        <Input 
                            type={showRepeatPassword ? "text" : "password"} 
                            {...register("repeatPassword", { 
                                required: "Please confirm your password",
                                validate: value => value === passwordValue || "Passwords do not match"
                            })} 
                            pr="12"
                        />
                        <IconButton
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

                <Button type="submit">Submit</Button>
            </Stack>
        </form>
    )
}

export default Register