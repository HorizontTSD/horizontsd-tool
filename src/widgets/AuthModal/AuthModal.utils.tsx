import { SetStateAction } from "react"
import validator from "validator"
import { FormErrors } from "./AuthModal.interfaces"

export const validateForm = (
    setErrors: (value: SetStateAction<FormErrors>) => void,
    formData: {
        email: string
        password: string
        confirmPassword?: string
    }
) => {
    const newErrors: FormErrors = {}

    if (!formData.email.trim()) {
        newErrors.email = "Email обязателен"
    } else if (!validator.isEmail(formData.email.trim())) {
        newErrors.email = "Некорректный формат email"
    }

    if (!formData.password) {
        newErrors.password = "Пароль обязателен"
    } else {
        const password = formData.password

        if (password.length < 8) {
            newErrors.password = "Пароль должен содержать минимум 8 символов"
        } else if (password.length > 128) {
            newErrors.password = "Пароль слишком длинный (максимум 128 символов)"
        } else if (!/(?=.*[a-z])/.test(password)) {
            newErrors.password = "Пароль должен содержать хотя бы одну строчную букву"
        } else if (!/(?=.*[A-Z])/.test(password)) {
            newErrors.password = "Пароль должен содержать хотя бы одну заглавную букву"
        } else if (!/(?=.*\d)/.test(password)) {
            newErrors.password = "Пароль должен содержать хотя бы одну цифру"
        } else if (!/(?=.*[@$!%*?&])/.test(password)) {
            newErrors.password = "Пароль должен содержать хотя бы один специальный символ (@$!%*?&)"
        } else if (/(.)\1{2,}/.test(password)) {
            newErrors.password = "Пароль не должен содержать 3 одинаковых символа подряд"
        } else if (/password|123456|qwerty/i.test(password)) {
            newErrors.password = "Пароль слишком простой"
        }
    }

    if (formData.confirmPassword !== undefined) {
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Подтверждение пароля обязательно"
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Пароли не совпадают"
        }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
}
