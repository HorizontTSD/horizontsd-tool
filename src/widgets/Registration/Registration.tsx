"use client"
import * as React from "react"
import { Typography, Box, Container, Paper, TextField, Button, Alert, Stack } from "@mui/material"
import { useAuth, User } from "@/app/providers/AuthProvider"
import { useNavigate } from "react-router"
import { validateForm } from "../AuthModal/AuthModal.utils"
import { FormErrors } from "../AuthModal/AuthModal.interfaces"

export default function RegisterPage() {
    type PartialUser = Partial<User>

    const [formData, setFormData] = React.useState<PartialUser>({
        email: "",
        first_name: "",
        last_name: "",
        organization: "",
        role: "",
        password: "",
        confirmPassword: "",
        permissions: [],
    })
    const [error, setError] = React.useState("")
    const [errors, setErrors] = React.useState<FormErrors>({})
    const { login, loading, setUser } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (
            !validateForm(setErrors, {
                email: formData.email || "",
                password: formData.password || "",
                confirmPassword: formData.confirmPassword || "",
            })
        )
            return

        try {
            setError("")

            // const response = await fetch("/api/auth/register",{
            //     method:"POST",
            //     headers:{
            //         "Content-Type":"application/json"
            //     },
            //     body: JSON.stringify(formData)
            // },

            // )
            // if(!response.ok){
            //  setError("Ошибка")

            // }

            if (formData?.email && formData?.password) {
                const loginRes = await login(formData!.email, formData?.password)

                if (loginRes.success) {
                    navigate("/")
                }

                if (formData) {
                    setUser(formData as User)
                }
            } else {
                setError("ошибка входа")
            }
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ mt: 8, mb: 8, p: 4 }}>
                <Typography component="h1" variant="h5" align="center" sx={{ mb: 3 }}>
                    Регистрация
                </Typography>

                <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Stack spacing={3}>
                        <TextField
                            variant="standard"
                            margin="normal"
                            required
                            fullWidth
                            label="Имя"
                            value={formData?.first_name}
                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        />

                        <TextField
                            variant="standard"
                            margin="normal"
                            required
                            fullWidth
                            label="Фамилия"
                            value={formData?.last_name}
                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        />

                        <TextField
                            variant="standard"
                            margin="normal"
                            required
                            fullWidth
                            label="Орагнизация"
                            value={formData?.organization}
                            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        />

                        <TextField
                            variant="standard"
                            margin="normal"
                            required
                            fullWidth
                            error={!!errors.email}
                            helperText={errors.email}
                            label="Email"
                            type="email"
                            value={formData?.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />

                        <TextField
                            variant="standard"
                            margin="normal"
                            required
                            fullWidth
                            error={!!errors.password}
                            helperText={errors.password}
                            label="Пароль"
                            type="password"
                            value={formData?.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />

                        <TextField
                            variant="standard"
                            margin="normal"
                            required
                            fullWidth
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                            label="Подтвердите пароль"
                            type="password"
                            value={formData?.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            // disabled={loading}
                        >
                            Зарегистрироваться
                            {/* {loading ? "Регистрация..." : "Зарегистрироваться"} */}
                        </Button>
                    </Stack>
                </Box>
            </Paper>
        </Container>
    )
}
