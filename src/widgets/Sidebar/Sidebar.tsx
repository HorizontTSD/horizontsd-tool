import { useColorScheme } from "@mui/material/styles"
import {
    Divider,
    Stack,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from "@mui/material"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import IconButton from "@mui/material/IconButton"
import Icon from "./Icon"
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft"
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight"
import ScreenShareIcon from "@mui/icons-material/ScreenShare"
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import StorageIcon from "@mui/icons-material/Storage"
import SmartToyIcon from "@mui/icons-material/SmartToy"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import AddIcon from "@mui/icons-material/Add"

import React, { useEffect, useMemo, useState } from "react"

const LS_KEY = "ai_agent_conversations_v1"
const UPDATE_EVENT = "agentChatsUpdated"

type Conversation = { id: string; title: string }

export const Sidebar = () => {
    const { t } = useTranslation()
    const { mode } = useColorScheme()
    const navigate = useNavigate()
    const isDark = mode === "dark"
    const bgPalette = ["var(--mui-palette-secondary-dark)", "var(--mui-palette-secondary-main)"]
    const bg = bgPalette[~~!isDark]

    const [opened, setOpened] = useState(true)
    const [agentOpen, setAgentOpen] = useState(false)
    const [chats, setChats] = useState<Conversation[]>([])

    const loadChats = useMemo(
        () => () => {
            try {
                const raw = localStorage.getItem(LS_KEY)
                const parsed = raw ? (JSON.parse(raw) as { id: string; title?: string }[]) : []
                setChats(parsed.map((c) => ({ id: c.id, title: c.title || t("widgets.aiAgent.newChatDefault") })))
            } catch {
                setChats([])
            }
        },
        [t]
    )

    useEffect(() => {
        loadChats()
        const handler = () => loadChats()
        window.addEventListener("storage", handler)
        window.addEventListener(UPDATE_EVENT, handler)
        return () => {
            window.removeEventListener("storage", handler)
            window.removeEventListener(UPDATE_EVENT, handler)
        }
    }, [loadChats])

    const handleDeleteChat = (id: string) => {
        try {
            const raw = localStorage.getItem(LS_KEY)
            const parsed = raw ? (JSON.parse(raw) as any[]) : []
            const next = parsed.filter((c) => c.id !== id)
            localStorage.setItem(LS_KEY, JSON.stringify(next))
            window.dispatchEvent(new Event(UPDATE_EVENT))
            setChats((prev) => prev.filter((c) => c.id !== id))
        } catch {
            // ignore
        }
    }

    const handleCreateChat = () => {
        try {
            const id = crypto.randomUUID()
            setAgentOpen(true)
            navigate(`/ai-agent/${id}`)
        } catch {
            // ignore
        }
    }

    const [confirmId, setConfirmId] = useState<string | null>(null)

    return (
        <Stack
            direction={"column"}
            sx={{
                height: `100%`,
                width: opened ? `20%` : `0`,
                minWidth: opened ? `250px` : `50px`,
                justifyContent: `start`,
                alignItems: `center`,
                borderRight: "1px solid",
                borderColor: bg,
                overflow: `hidden`,
                padding: 0,
                margin: 0,
            }}
        >
            <Stack
                sx={{
                    width: `100%`,
                    display: "flex",
                    justifyContent: opened ? "space-between" : "center",
                    paddingLeft: opened ? `1rem` : `0`,
                    alignItems: "center",
                    flexDirection: `row`,
                    minHeight: `60px`,
                    boxSizing: `border-box`,
                    borderBottom: "1px solid",
                    borderColor: bg,
                    boxShadow: `none`,
                }}
            >
                {opened && <Icon color={bg} size={"s"} />}

                {opened && (
                    <Typography
                        variant="h5"
                        sx={{
                            marginLeft: `1rem`,
                            lineHeight: `1rem`,
                            marginBottom: `-3px`,
                        }}
                    >
                        HorizonTSD
                    </Typography>
                )}

                <IconButton
                    size="small"
                    color="primary"
                    onClick={() => {
                        setOpened(!opened)
                    }}
                >
                    {opened ? <ArrowCircleLeftIcon /> : <ArrowCircleRightIcon />}
                </IconButton>
            </Stack>
            <Stack
                direction={"column"}
                sx={{
                    height: `100%`,
                    width: `100%`,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: `start`,
                }}
            >
                <List sx={{ width: "100%" }}>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/" sx={{ padding: 1 }}>
                            <IconButton size="small" color="secondary">
                                <ScreenShareIcon />
                            </IconButton>
                            {opened && <ListItemText primary={t("widgets.navBar.path.main")} />}
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/alert" sx={{ padding: 1 }}>
                            <IconButton size="small" color="secondary">
                                <AccessAlarmIcon />
                            </IconButton>
                            {opened && <ListItemText primary={t("widgets.navBar.path.alerts")} />}
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/forecast" sx={{ padding: 1 }}>
                            <IconButton size="small" color="secondary">
                                <AddCircleIcon />
                            </IconButton>
                            {opened && <ListItemText primary={t("widgets.navBar.path.forecast")} />}
                        </ListItemButton>
                    </ListItem>
                    {opened && <Divider />}
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/db-connections" sx={{ padding: 1 }}>
                            <IconButton size="small" color="secondary">
                                <StorageIcon />
                            </IconButton>
                            {opened && <ListItemText primary={t("widgets.navBar.path.dbConnections")} />}
                        </ListItemButton>
                    </ListItem>

                    {/* AI Agent with collapsible chats */}
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => setAgentOpen((v) => !v)} sx={{ padding: 1 }}>
                            <IconButton size="small" color="secondary">
                                <SmartToyIcon />
                            </IconButton>
                            {opened && <ListItemText primary={t("widgets.navBar.path.aiAgent")} />}
                            {opened && (agentOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
                        </ListItemButton>
                    </ListItem>
                    {agentOpen && opened && (
                        <List sx={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto", pr: 1 }}>
                            <ListItem>
                                <ListItemButton
                                    onClick={handleCreateChat}
                                    sx={{ py: 0.25, bgcolor: "action.selected", borderRadius: 1 }}
                                >
                                    <IconButton size="small" sx={{ mr: 1 }}>
                                        <AddIcon fontSize="small" />
                                    </IconButton>
                                    <ListItemText
                                        primary={t("widgets.aiAgent.newChat", { defaultValue: "Новый чат" })}
                                    />
                                </ListItemButton>
                            </ListItem>
                            {chats.map((c) => (
                                <ListItem
                                    key={c.id}
                                    secondaryAction={
                                        <IconButton edge="end" size="small" onClick={() => setConfirmId(c.id)}>
                                            <DeleteOutlineIcon fontSize="small" />
                                        </IconButton>
                                    }
                                >
                                    <ListItemButton onClick={() => navigate(`/ai-agent/${c.id}`)} sx={{ py: 0.25 }}>
                                        <ListItemText slotProps={{ primary: { noWrap: true } }} primary={c.title} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    )}

                    {/* Убрано дублирование ссылки ИИ агента в свёрнутом состоянии */}
                </List>
            </Stack>

            {/* Диалог подтверждения удаления */}
            <Dialog open={!!confirmId} onClose={() => setConfirmId(null)}>
                <DialogTitle>{t("widgets.aiAgent.confirmDelete.title")}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{t("widgets.aiAgent.confirmDelete.text")}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmId(null)}>{t("widgets.aiAgent.confirmDelete.cancel")}</Button>
                    <Button
                        color="error"
                        onClick={() => (confirmId && handleDeleteChat(confirmId), setConfirmId(null))}
                    >
                        {t("widgets.aiAgent.confirmDelete.delete")}
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    )
}
