import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Fade,
    Modal,
    Stack,
    TextField,
    Typography,
} from "@mui/material"
import { useState } from "react"
import { authCardSx, btn, btnReg, modalSx } from "./AuthModal.styles"
import { useAuth } from "@/app/providers/AuthProvider"
import { validateForm } from "./AuthModal.utils"
import { AuthModalProps, FormErrors } from "./AuthModal.interfaces"

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen }) => {
    const [error, setError] = useState<string>("")
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const [errors, setErrors] = useState<FormErrors>({})
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }))
        }

        if (error) {
            setError("")
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!validateForm(setErrors, formData)) return
        setLoading(true)

        setError("")

        try {
            const result = await login(formData.email, formData.password)

            if (result.success) {
                console.log("Успешная авторизация")
            } else {
                setError(result.error || "Ошибка аутентификации")
            }
        } catch (err) {
            setError("Произошла ошибка")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) {
        return null
    }

    const handleRegister = () => {
        setLoading(true)

        window.location.href = "/register"
    }

    return (
        <Modal
            open={isOpen!}
            closeAfterTransition
            slotProps={{
                backdrop: {
                    sx: { modalSx },
                },
            }}
        >
            <Fade in={isOpen}>
                <Card sx={authCardSx}>
                    <CardContent>
                        <Typography variant="h5" component="h2" sx={{ mb: 3, textAlign: "center" }}>
                            Авторизация
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit}>
                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}
                            <Stack spacing={3}>
                                <TextField
                                    type="email"
                                    label="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    required
                                    fullWidth
                                    variant="standard"
                                    margin="normal"
                                />
                                <TextField
                                    type="password"
                                    label="Password"
                                    name="password"
                                    variant="standard"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    error={!!errors.password}
                                    helperText={errors.password}
                                    required
                                    fullWidth
                                    margin="normal"
                                />

                                <Box display="flex" gap={1} alignItems="center">
                                    <Button type="submit" fullWidth variant="contained" disabled={loading} sx={btn}>
                                        {loading ? "Вход..." : "Войти"}
                                    </Button>
                                </Box>
                                <Button
                                    type="button"
                                    fullWidth
                                    variant="contained"
                                    disabled={loading}
                                    sx={btnReg}
                                    onClick={handleRegister}
                                >
                                    {loading ? "Вход..." : "Зарегистрироваться"}
                                </Button>
                            </Stack>
                        </Box>

                        {loading && (
                            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                                <CircularProgress size={24} />
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Fade>
        </Modal>
    )
}
