import React from "react"
import { Box, Paper, Typography, IconButton, Button, Stack, Tooltip } from "@mui/material"
import SmartToyIcon from "@mui/icons-material/SmartToy"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import EditIcon from "@mui/icons-material/Edit"
import ReplayIcon from "@mui/icons-material/Replay"
import { useTranslation } from "react-i18next"
import { ChatMessageProps } from "./types"

export const ChatMessage: React.FC<ChatMessageProps> = ({
    message,
    index,
    selectedId,
    isEditing,
    editingText,
    onEdit,
    onStartEdit,
    onSaveEdit,
    onCancelEdit,
    onCopy,
    onRegenerate,
}) => {
    const { t } = useTranslation()
    const { role, content } = message

    if (isEditing) {
        return (
            <Box sx={{ width: "100%" }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <textarea
                        value={editingText}
                        onChange={(e) => onEdit(e.currentTarget.value)}
                        rows={Math.max(5, editingText.split("\n").length + 2)}
                        style={{
                            width: "100%",
                            background: "transparent",
                            border: "1px solid #e0e0e0",
                            borderRadius: "8px",
                            padding: "12px",
                            outline: "none",
                            font: "inherit",
                            fontSize: "14px",
                            lineHeight: 1.5,
                            resize: "none",
                            minHeight: "80px",
                        }}
                    />
                    <Stack direction="row" gap={1} justifyContent="flex-end">
                        <Button size="small" variant="outlined" color="secondary" onClick={onCancelEdit}>
                            {t("widgets.aiAgent.cancelTooltip", { defaultValue: "Cancel" })}
                        </Button>
                        <Button size="small" variant="contained" color="primary" onClick={() => onSaveEdit(index)}>
                            {t("widgets.aiAgent.saveTooltip", { defaultValue: "Save" })} &{" "}
                            {t("widgets.aiAgent.submit", { defaultValue: "Submit" })}
                        </Button>
                    </Stack>
                </Box>
            </Box>
        )
    }

    return (
        <>
            <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
                {role === "assistant" && (
                    <Box sx={{ display: "flex", alignItems: "center", height: "24px", mt: 1.5 }}>
                        <IconButton size="small" color="secondary">
                            <SmartToyIcon fontSize="small" />
                        </IconButton>
                    </Box>
                )}
                <Paper
                    data-msg-key={`${selectedId}-${index}`}
                    sx={{
                        p: 1.5,
                        bgcolor: role === "user" ? "action.hover" : "transparent",
                        color: "inherit",
                        boxShadow: "none",
                        flex: 1,
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        maxWidth: "100%",
                    }}
                >
                    {content.split("\n").map((line, i) =>
                        line.startsWith("image://") ? (
                            <Box key={`img-${i}`} sx={{ mt: i === 0 ? 0 : 0.5 }}>
                                <img
                                    src={line.replace("image://", "")}
                                    alt="attachment"
                                    style={{ maxWidth: "100%", borderRadius: 8 }}
                                />
                            </Box>
                        ) : (
                            <Typography
                                key={i}
                                variant="body2"
                                sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                            >
                                {line}
                            </Typography>
                        )
                    )}
                </Paper>
            </Box>

            {/* Действия: вне фона */}
            <Stack direction="row" gap={0.5} sx={{ mt: 0.5, ml: role === "assistant" ? 4 : 0 }}>
                <Tooltip title={t("widgets.aiAgent.copyTooltip", { defaultValue: "Copy" })}>
                    <IconButton size="small" onClick={() => onCopy(content)}>
                        <ContentCopyIcon fontSize="inherit" />
                    </IconButton>
                </Tooltip>
                {role === "user" && (
                    <Tooltip title={t("widgets.aiAgent.editTooltip", { defaultValue: "Edit" })}>
                        <IconButton size="small" onClick={() => onStartEdit(index)}>
                            <EditIcon fontSize="inherit" />
                        </IconButton>
                    </Tooltip>
                )}
                {role === "assistant" && (
                    <Tooltip title={t("widgets.aiAgent.regenerateTooltip", { defaultValue: "Regenerate" })}>
                        <IconButton size="small" onClick={() => onRegenerate(index)}>
                            <ReplayIcon fontSize="inherit" />
                        </IconButton>
                    </Tooltip>
                )}
            </Stack>
        </>
    )
}
