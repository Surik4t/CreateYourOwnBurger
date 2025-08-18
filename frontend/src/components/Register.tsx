import { Button, Field, Input, Stack } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
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
    } = useForm<FormValues>()

    const onSubmit = async (data: FormValues) => {
        try {
            const response = await axios.post("http://localhost:8000/users/", {
                username: data.username,
                email: data.email,
                password: data.password,
                disabled: false,
            });
            console.log("Registration successful:", response.data);
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="4" align="flex-start" maxW="sm">
                <Field.Root invalid={!!errors.username}>
                    <Field.Label>Username</Field.Label>
                        <Input {...register("username")} />
                    <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!errors.email}>
                    <Field.Label>Email</Field.Label>
                        <Input {...register("email")} />
                    <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!errors.password}>
                    <Field.Label>Password</Field.Label>
                        <Input {...register("password")} />
                    <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!errors.repeatPassword}>
                    <Field.Label>Repeat Password</Field.Label>
                        <Input {...register("repeatPassword")} />
                    <Field.ErrorText>{errors.repeatPassword?.message}</Field.ErrorText>
                </Field.Root>

                <Button type="submit">Submit</Button>
            </Stack>
        </form>
    )
}

export default Register