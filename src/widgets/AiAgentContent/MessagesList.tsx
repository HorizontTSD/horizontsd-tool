import React from "react"
import { Box, Stack, Typography, CircularProgress } from "@mui/material"
import { ChatMessage } from "./ChatMessage"
import { MessagesListProps } from "./types"

export const MessagesList: React.FC<MessagesListProps> = ({
    messages,
    selectedId,
    isLoading,
    messagesRef,
    onScroll,
    editingMessageId,
    editingText,
    setEditingText,
    startEditMessage,
    saveEditMessage,
    cancelEditMessage,
    copyToClipboard,
    regenerateLastAssistant,
}) => {
    return (
        <Box
            ref={messagesRef}
            onScroll={onScroll}
            sx={{ flex: 1, overflow: "auto", p: 2, display: "flex", flexDirection: "column", gap: 1 }}
        >
            {messages.map((message, idx) => {
                const isEditing = editingMessageId === `${selectedId}-${idx}` && message.role === "user"
                return (
                    <Box
                        key={idx}
                        sx={{
                            alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                            maxWidth: isEditing ? "95%" : "95%",
                            minWidth: "50px",
                            width: isEditing ? "100%" : "fit-content",
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                        }}
                    >
                        <ChatMessage
                            message={message}
                            index={idx}
                            selectedId={selectedId}
                            isEditing={isEditing}
                            editingText={editingText}
                            onEdit={setEditingText}
                            onStartEdit={startEditMessage}
                            onSaveEdit={saveEditMessage}
                            onCancelEdit={cancelEditMessage}
                            onCopy={copyToClipboard}
                            onRegenerate={regenerateLastAssistant}
                        />
                    </Box>
                )
            })}
            {isLoading && (
                <Stack direction="row" gap={1} alignItems="center">
                    <CircularProgress size={18} />
                    <Typography variant="body2" color="text.secondary">
                        Loading...
                    </Typography>
                </Stack>
            )}
        </Box>
    )
}
