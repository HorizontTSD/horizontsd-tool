import { Box, Stack, Typography, Button, Menu, MenuItem } from "@mui/material"
import VisibilityIcon from "@mui/icons-material/Visibility"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import React, { useState } from "react"

const StateLabel = ({ state }: { state: "normal" | "firing" }) => (
    <Box
        sx={{
            width: 124,
            height: 27,
            borderRadius: 999,
            fontWeight: 600,
            fontSize: 16,
            color: "white",
            background: state === "normal" ? "#00E600" : "#C30052",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
        }}
    >
        {state === "normal" ? "Normal" : "Firing"}
    </Box>
)

const AlertBlock = ({
    state,
    name,
    health,
    summary,
    nextEval,
    expanded,
    onToggle,
    onEdit,
    onDelete,
}: {
    state: "normal" | "firing"
    name: string
    health: string
    summary: string
    nextEval: string
    expanded: boolean
    onToggle: () => void
    onEdit?: () => void
    onDelete?: () => void
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation()
        setAnchorEl(event.currentTarget)
    }
    const handleMenuClose = () => setAnchorEl(null)
    const handleEdit = () => {
        handleMenuClose()
        if (onEdit) onEdit()
    }
    const handleDelete = () => {
        handleMenuClose()
        if (onDelete) onDelete()
    }
    return (
        <Box
            sx={{
                background: expanded ? "#21384B" : "#e3ecf5",
                borderRadius: "8px",
                p: 2,
                mb: 2,
                cursor: "pointer",
                boxShadow: expanded ? "0 2px 12px 0 rgba(0,0,0,0.10)" : "none",
                overflow: "hidden",
                color: expanded ? "white" : "#21384B",
            }}
            onClick={onToggle}
        >
            {!expanded && (
                <Stack direction="row" alignItems="center" spacing={4}>
                    <Stack direction="row" alignItems="center" spacing={1} minWidth={120}>
                        <Typography fontSize={18} color={expanded ? "white" : "#21384B"}>
                            State
                        </Typography>
                        <StateLabel state={state} />
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1} minWidth={200}>
                        <Typography fontSize={18} color={expanded ? "white" : "#21384B"}>
                            Name
                        </Typography>
                        <Typography
                            fontSize={16}
                            color={expanded ? "#73BF69" : "#1976d2"}
                            sx={{
                                width: 180,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {name}
                        </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1} minWidth={120}>
                        <Typography fontSize={18} color={expanded ? "white" : "#21384B"}>
                            Health
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box component="span" sx={{ color: "#FF6B00", fontSize: 22, mr: 0.5 }}>
                                ⚠️
                            </Box>
                            <Typography fontSize={16} color="#FF6B00">
                                error
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1} minWidth={200}>
                        <Typography fontSize={18} color={expanded ? "white" : "#21384B"}>
                            Next Evaluation
                        </Typography>
                        <Typography fontSize={16} color={expanded ? "#73BF69" : "#1976d2"}>
                            {nextEval}
                        </Typography>
                    </Stack>
                </Stack>
            )}
            <Box
                sx={{
                    height: expanded ? "auto" : "0",
                    opacity: expanded ? 1 : 0,
                    transition: "height 0.3s ease, opacity 0.3s ease",
                    pointerEvents: expanded ? "auto" : "none",
                    overflow: "hidden",
                }}
            >
                {expanded && (
                    <Stack direction="row" spacing={6} mt={2}>
                        <Box>
                            <Typography fontWeight={700} fontSize={28} color="white">
                                State
                            </Typography>
                            <Stack spacing={2} mt={2}>
                                <Stack direction="row" spacing={1}>
                                    <Typography fontSize={16}>Evaluate</Typography>
                                    <Typography fontSize={16} color="#b0b0b0">
                                        Every 1m
                                    </Typography>
                                </Stack>
                                <Stack direction="row" spacing={1}>
                                    <Typography fontSize={16}>Keep firing for</Typography>
                                    <Typography fontSize={16} color="#b0b0b0">
                                        0s
                                    </Typography>
                                </Stack>
                                <Stack direction="row" spacing={1}>
                                    <Typography fontSize={16}>Last evaluation</Typography>
                                    <Typography fontSize={16} color="#b0b0b0">
                                        a minute ago
                                    </Typography>
                                </Stack>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography fontSize={16}>Labels</Typography>
                                    <Box
                                        sx={{
                                            background: "#01579B",
                                            borderRadius: 999,
                                            px: 2,
                                            py: 0.5,
                                            color: "white",
                                            fontWeight: 400,
                                            width: "100px",
                                            height: "28px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        telegram
                                    </Box>
                                    <Box
                                        sx={{
                                            background: "#01579B",
                                            borderRadius: 999,
                                            px: 2,
                                            py: 0.5,
                                            color: "white",
                                            fontWeight: 400,
                                            width: "100px",
                                            height: "28px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        email
                                    </Box>
                                </Stack>
                                <Stack direction="row" spacing={1}>
                                    <Typography fontSize={16}>Alert ID</Typography>
                                    <Typography fontSize={16} color="#b0b0b0">
                                        0000000000000000
                                    </Typography>
                                </Stack>
                                <Stack direction="row" spacing={1}>
                                    <Typography fontSize={16}>Event ID</Typography>
                                    <Typography fontSize={16} color="#b0b0b0">
                                        0000000000000000
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Box>
                        <Box>
                            <Typography fontWeight={700} fontSize={28} color="white">
                                Name
                            </Typography>
                            <Typography fontSize={16} color="#b0b0b0" mt={2}>
                                {name}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography fontWeight={700} fontSize={28} color="white">
                                Health
                            </Typography>
                            <Typography fontSize={16} color="#00E600" mt={2}>
                                ok
                            </Typography>
                        </Box>
                        <Box>
                            <Typography fontWeight={700} fontSize={28} color="white">
                                Summary
                            </Typography>
                            <Typography fontSize={16} color="#b0b0b0" mt={2}>
                                {summary}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography fontWeight={700} fontSize={28} color="white">
                                Next Evaluation
                            </Typography>
                            <Typography fontSize={16} color="#b0b0b0" mt={2}>
                                {nextEval}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography fontWeight={700} fontSize={28} color="white">
                                Actions
                            </Typography>
                            <Stack direction="row" spacing={1} mt={2} alignItems="center">
                                <Button
                                    size="small"
                                    variant="contained"
                                    sx={{
                                        background: "#01579B",
                                        borderRadius: 999,
                                        textTransform: "none",
                                        width: "77px",
                                        height: "28px",
                                        color: "#F5F5F5",
                                    }}
                                    startIcon={<VisibilityIcon sx={{ color: "#F5F5F5" }} />}
                                >
                                    view
                                </Button>
                                <Button
                                    size="small"
                                    variant="contained"
                                    sx={{
                                        background: "#01579B",
                                        borderRadius: 999,
                                        textTransform: "none",
                                        width: "93px",
                                        height: "28px",
                                        color: "#F5F5F5",
                                    }}
                                    endIcon={<KeyboardArrowDownIcon sx={{ color: "#F5F5F5" }} />}
                                    onClick={handleMenuOpen}
                                >
                                    More
                                </Button>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                                    transformOrigin={{ vertical: "top", horizontal: "center" }}
                                    slotProps={{ paper: { sx: { mt: 0.5, width: "93px" } } }}
                                >
                                    <MenuItem onClick={handleEdit}>Edit</MenuItem>
                                    <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
                                        Delete
                                    </MenuItem>
                                </Menu>
                            </Stack>
                        </Box>
                    </Stack>
                )}
            </Box>
        </Box>
    )
}

export default AlertBlock
