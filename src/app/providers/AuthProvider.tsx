"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export interface User {
    email: string
    password?: string
    confirmPassword?: string
    first_name: string
    last_name: string
    organization: string
    role: string
    permissions: string[]
}

interface AuthContextType {
    user: User | null
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
    logout: () => void
    loading: boolean
    showLoginModal: boolean
    isAuthenticated: boolean
    hasPermission: (permission: string) => boolean
    setUser: React.Dispatch<React.SetStateAction<User | null>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    // const [initialized, setInitialized] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [showLoginModal, setShowLoginModal] = useState(false)

    useEffect(() => {
        const initializeAuth = () => {
            setLoading(true)

            const token = localStorage.getItem("accessToken")
            const userData = localStorage.getItem("userData")

            if (token && userData) {
                try {
                    const parsedUser = JSON.parse(userData)
                    setUser(parsedUser)
                    setIsAuthenticated(true)
                    setShowLoginModal(false)
                } catch (error) {
                    console.error("Error parsing user data:", error)
                    localStorage.removeItem("accessToken")
                    localStorage.removeItem("userData")
                    setShowLoginModal(true)
                }
            } else {
                setUser(null)
                setIsAuthenticated(false)
                setShowLoginModal(true)
            }

            setLoading(false)
        }

        initializeAuth()

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "accessToken" || e.key === "userData") {
                const token = localStorage.getItem("accessToken")
                const userData = localStorage.getItem("userData")

                if (token && userData) {
                    try {
                        const parsedUser = JSON.parse(userData)
                        setUser(parsedUser)
                        setIsAuthenticated(true)
                        setShowLoginModal(false)
                    } catch (error) {
                        console.error("Error parsing user data:", error)
                        setUser(null)
                        setIsAuthenticated(false)
                        setShowLoginModal(true)
                    }
                } else {
                    setUser(null)
                    setIsAuthenticated(false)
                    setShowLoginModal(true)
                }
            }
        }

        window.addEventListener("storage", handleStorageChange)

        return () => {
            window.removeEventListener("storage", handleStorageChange)
        }
    }, [])

    const login = async (email: string, password: string) => {
        try {
            setLoading(true)

            let userData: User
            const token = "fake-jwt-token-" + Date.now()
            const refreshToken = "fake-refresh-token-" + Date.now()

            //isAdmin

            if (import.meta.env.VITE_DISABLE_AUTH === "true") {
                userData = {
                    email,
                    first_name: "Иван",
                    last_name: "Иванов",
                    organization: "ООО Тестовая",
                    role: "admin",
                    permissions: ["all"],
                }
            } else {
                userData = {
                    email,
                    first_name: "Пользователь",
                    last_name: "",
                    organization: "",
                    role: "user",
                    permissions: ["read"],
                }
            }

            localStorage.setItem("accessToken", token)
            localStorage.setItem("refreshToken", refreshToken)
            localStorage.setItem("userData", JSON.stringify(userData))

            setUser(userData)
            setIsAuthenticated(true)
            setShowLoginModal(false)

            return { success: true }
            // }
        } catch (error) {
            return { success: false, error: "Ошибка сети" }
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("userData")

        localStorage.clear()
        setUser(null)

        setIsAuthenticated(false)
        setShowLoginModal(true)
    }

    const hasPermission = (permission: string): boolean => {
        if (!user) return false
        return user.permissions.includes("all") || user.permissions.includes(permission)
    }

    useEffect(() => {
        if (window.location.pathname === "/register") {
            setShowLoginModal(false)
        }
    }, [])

    const value: AuthContextType = {
        user,
        login,
        logout,
        loading,
        showLoginModal,
        isAuthenticated,
        hasPermission,
        setUser,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
