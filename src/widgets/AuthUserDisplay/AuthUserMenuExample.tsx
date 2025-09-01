import { Menu, MenuItem, IconButton, Typography, Box, CircularProgress, Button } from "@mui/material"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import { useState } from "react"
import { User } from "../AuthModal/AuthModal.interfaces"
import { btnExit } from "./AuthUserDisplay.styles"

interface AuthUserMenuExampleProps {
    user: User | null | undefined
    logout: () => void
}

const AuthUserMenuExample: React.FC<AuthUserMenuExampleProps> = ({ user, logout }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
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
                                : user.first_name || user.email || "Пользователь"}
                        </Typography>
                    </Box>
                </MenuItem>
                <MenuItem sx={{ display: "flex", gap: 1 }}>
                    <Typography variant="body2">Компания:</Typography>
                    <Typography variant="body2">
                        {user.organization ? user.organization : "Неизвестная компания"}
                    </Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <Button variant="contained" color="primary" sx={btnExit}>
                        Выйти
                    </Button>
                </MenuItem>
            </Menu>
        </>
    )
}

export default AuthUserMenuExample
