import { SetStateAction } from "react"
import { FormErrors } from "./types"
import * as yup from "yup"

interface ValidationMessages {
    emailRequired: string
    invalidEmail: string
    passwordRequired: string
    passwordMinLength: string
    passwordMaxLength: string
    passwordLowercase: string
    passwordUppercase: string
    passwordNumber: string
    passwordSpecial: string
    passwordNoRepeat: string
    passwordNotSimple: string
    confirmPasswordRequired: string
    passwordsNotMatch: string
}

export const getValidationMessages = (t: any) => ({
    emailRequired: t("validation.emailRequired"),
    invalidEmail: t("validation.invalidEmail"),
    passwordRequired: t("validation.passwordRequired"),
    passwordMinLength: t("validation.passwordMinLength"),
    passwordMaxLength: t("validation.passwordMaxLength"),
    passwordLowercase: t("validation.passwordLowercase"),
    passwordUppercase: t("validation.passwordUppercase"),
    passwordNumber: t("validation.passwordNumber"),
    passwordSpecial: t("validation.passwordSpecial"),
    passwordNoRepeat: t("validation.passwordNoRepeat"),
    passwordNotSimple: t("validation.passwordNotSimple"),
    confirmPasswordRequired: t("validation.confirmPasswordRequired"),
    passwordsNotMatch: t("validation.passwordsNotMatch"),
})

export interface RegisterFormData {
    email: string
    password: string
    confirmPassword: string | null
}

export const createLoginSchema = (messages: any) => {
    return yup.object().shape({
        email: yup.string().required(messages.emailRequired).email(messages.invalidEmail).trim(),

        password: yup
            .string()
            .required(messages.passwordRequired)
            .min(8, messages.passwordMinLength)
            .max(128, messages.passwordMaxLength)
            .matches(/(?=.*[a-z])/, messages.passwordLowercase)
            .matches(/(?=.*[A-Z])/, messages.passwordUppercase)
            .matches(/(?=.*\d)/, messages.passwordNumber)
            .matches(/(?=.*[@$!%*?&])/, messages.passwordSpecial)
            .test("no-repeated-chars", messages.passwordNoRepeat, (value) => !/(.)\1{2,}/.test(value))
            .test("not-simple", messages.passwordNotSimple, (value) => !/password|123456|qwerty/i.test(value)),
    })
}

export const createRegisterSchema = (messages: ValidationMessages) => {
    return yup.object({
        email: yup.string().required(messages.emailRequired).email(messages.invalidEmail).trim(),

        password: yup
            .string()
            .required(messages.passwordRequired)
            .min(8, messages.passwordMinLength)
            .max(128, messages.passwordMaxLength)
            .matches(/(?=.*[a-z])/, messages.passwordLowercase)
            .matches(/(?=.*[A-Z])/, messages.passwordUppercase)
            .matches(/(?=.*\d)/, messages.passwordNumber)
            .matches(/(?=.*[@$!%*?&])/, messages.passwordSpecial)
            .test("no-repeated-chars", messages.passwordNoRepeat, (value) => (value ? !/(.)\1{2,}/.test(value) : true))
            .test("not-simple", messages.passwordNotSimple, (value) =>
                value ? !/password|123456|qwerty/i.test(value) : true
            ),

        confirmPassword: yup
            .string()
            .nullable()
            .notRequired()
            .test("confirmPasswordRequired", messages.confirmPasswordRequired, function (value) {
                if (value == null || value === "") {
                    return true
                }
                return !!this.parent.password
            })
            .test("passwordsMatch", messages.passwordsNotMatch, function (value) {
                if (value == null || value === "") {
                    return true
                }
                return value === this.parent.password
            }),
    })
}

type SetErrorsFunction = (value: SetStateAction<FormErrors>) => void

export const validateForm = async <T extends Record<string, any>>(
    schema: yup.ObjectSchema<T>,
    setErrors: SetErrorsFunction,
    formData: T
) => {
    try {
        await schema.validate(formData, { abortEarly: false })
        setErrors({})
        return true
    } catch (err: any) {
        const newErrors: FormErrors = {}

        if (err.inner && Array.isArray(err.inner)) {
            err.inner.forEach((error: yup.ValidationError) => {
                const path = error.path as keyof FormErrors
                if (path) {
                    newErrors[path] = error.message
                }
            })
        } else if (err.path) {
            const path = err.path as keyof FormErrors
            newErrors[path] = err.message
        }

        setErrors(newErrors)
        return false
    }
}
