import { useAuth } from "@/app/providers/AuthProvider"
import { Box, CircularProgress, Tooltip, Typography } from "@mui/material"
import AuthUserMenuExample from "./AuthUserMenuExample"
import { useTranslation } from "react-i18next"

const AuthUserDisplay = () => {
    const { t } = useTranslation()
    const { user, isAuthenticated, loading, logout } = useAuth()

    if (loading) {
        return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={20} />
            </Box>
        )
    }

    if (!user || !isAuthenticated) {
        console.log("User not authenticated or no user data", { user, isAuthenticated })
        return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                    variant="body2"
                    sx={{
                        display: { xs: "none", sm: "block" },
                        maxWidth: 150,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                ></Typography>
            </Box>
        )
    }

    return (
        <Tooltip title="">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                    variant="body2"
                    sx={{
                        display: { xs: "none", sm: "block" },
                        maxWidth: 150,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {user.first_name && user.last_name
                        ? `${user.first_name} ${user.last_name}`
                        : user.first_name || user.email || t("widgets.mock_data.user")}
                </Typography>

                <AuthUserMenuExample user={user} logout={logout} />
            </Box>
        </Tooltip>
    )
}

export default AuthUserDisplay
