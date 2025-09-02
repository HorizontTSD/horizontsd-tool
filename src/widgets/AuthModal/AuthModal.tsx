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
    useColorScheme,
} from "@mui/material"
import { useState } from "react"
import { useAuth } from "@/app/providers/AuthProvider"
import { AuthModalProps, FormData, FormErrors } from "./types"
import { useTranslation } from "react-i18next"
import { createLoginSchema, createRegisterSchema, getValidationMessages, validateForm } from "./AuthModal.utils"
import { brand, gray } from "@/shared/theme/colors"

const commonStyles = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: 400 },
    borderRadius: 1,
}

const glassStyles = {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    backdropFilter: "blur(4px)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
}

const normalStyles = {
    maxWidth: 500,
    maxHeight: "90vh",
    overflow: "auto",
    outline: "none",
    boxShadow: 24,
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen }) => {
    const { t } = useTranslation()
    const [error, setError] = useState<string>("")
    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [errors, setErrors] = useState<FormErrors>({})
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const messages = getValidationMessages(t)
    const { mode } = useColorScheme()
    const isDark = mode === "dark"

    const loginSchema = createLoginSchema(messages)
    const registerSchema = createRegisterSchema(messages)

    const schema = formData.confirmPassword !== undefined ? registerSchema : loginSchema

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

        const isValid = await validateForm(schema, setErrors, formData)
        if (!isValid) return

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
                    sx: { backgroundColor: "rgba(0, 0, 0, 0.8)" },
                },
            }}
        >
            <Fade in={isOpen}>
                <Card sx={{ ...commonStyles, ...(isDark ? glassStyles : normalStyles) }}>
                    <CardContent>
                        <Typography variant="h5" component="h2" sx={{ mb: 3, textAlign: "center" }}>
                            {t("widgets.auth.title")}
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
                                    label={t("widgets.auth.email")}
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
                                    label={t("widgets.auth.password")}
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
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        disabled={loading}
                                        sx={{
                                            px: 0,
                                            height: 40,
                                            backgroundColor: brand[700],
                                            borderRadius: 0.5,
                                            color: gray[50],
                                            "&:hover": {
                                                backgroundColor: brand[600],
                                            },
                                        }}
                                    >
                                        {loading ? t("widgets.auth.entry") : t("widgets.auth.login")}
                                    </Button>
                                </Box>
                                <Button
                                    type="button"
                                    fullWidth
                                    variant="contained"
                                    disabled={loading}
                                    sx={{
                                        px: 3,
                                        height: 40,
                                        backgroundColor: brand[700],
                                        borderRadius: 0.5,
                                        color: gray[50],
                                        "&:hover": {
                                            backgroundColor: brand[600],
                                        },
                                    }}
                                    onClick={handleRegister}
                                >
                                    {loading ? t("widgets.auth.entry") : t("widgets.auth.register")}
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
