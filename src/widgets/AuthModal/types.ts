export interface User {
    // id: string
    email: string
    role: string
    permissions: string[]
    first_name: string
    last_name: string
    organization: string
}

export interface AuthResponse {
    accessToken: string
    refreshToken: string
    user: User
}

export interface AuthModalProps {
    isOpen?: boolean
    onClose?: () => void
    onAuthSuccess?: () => void
}

export interface FormErrors {
    email?: string
    password?: string
    confirmPassword?: string
}

export interface FormData {
    email: string
    password: string
    confirmPassword?: string
}
