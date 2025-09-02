import { Menu, MenuItem, IconButton, Typography, Box, CircularProgress, Button } from "@mui/material"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import { useState } from "react"
import { User } from "../AuthModal/types"
import { useTranslation } from "react-i18next"
import { brand } from "@/shared/theme/colors"

interface AuthUserMenuExampleProps {
    user: User | null | undefined
    logout: () => void
}

const AuthUserMenuExample: React.FC<AuthUserMenuExampleProps> = ({ user, logout }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const { t } = useTranslation()
    const open = Boolean(anchorEl)

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleLogout = () => {
        if (logout) {
            logout()
        }
    }

    if (!user) {
        return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={20} />
            </Box>
        )
    }

    return (
        <>
            <IconButton
                aria-label="more"
                aria-controls={open ? "long-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    "aria-labelledby": "long-button",
                }}
                anchorEl={anchorEl}
                open={open}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                PaperProps={{
                    sx: {
                        marginLeft: "-100px",
                    },
                }}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1 }}>
                        <Typography variant="body2">
                            {user.first_name && user.last_name
                                ? `${user.first_name} ${user.last_name}`
                                : user.first_name || user.email || t("widgets.mock_data.user")}
                        </Typography>
                    </Box>
                </MenuItem>
                <MenuItem sx={{ display: "flex", gap: 1 }}>
                    <Typography variant="body2"> {t("widgets.auth.company")}:</Typography>
                    <Typography variant="body2">
                        {user.organization ? user.organization : t("widgets.auth.Unknown_company")}
                    </Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{
                            backgroundColor: brand[500],
                            color: "white",
                            borderRadius: "8px",
                            padding: "5px 10px",
                            width: "100%",
                            textTransform: "none",
                            boxShadow: "0 2px 4px rgba(0, 127, 255, 0.2)",
                            "&:hover": {
                                backgroundColor: brand[600],
                                boxShadow: "0 4px 8px rgba(0, 127, 255, 0.3)",
                            },
                        }}
                    >
                        {t("widgets.auth.logout")}
                    </Button>
                </MenuItem>
            </Menu>
        </>
    )
}

export default AuthUserMenuExample
