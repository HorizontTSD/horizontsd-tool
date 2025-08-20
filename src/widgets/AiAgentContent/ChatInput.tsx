import React, { useState, useRef, useCallback, useLayoutEffect } from "react"
import { Box, IconButton, Stack } from "@mui/material"
import AttachFileIcon from "@mui/icons-material/AttachFile"
import SendIcon from "@mui/icons-material/Send"
import CloseIcon from "@mui/icons-material/Close"
import { ChatInputProps, ImageAttachment } from "./types"

export const ChatInput: React.FC<
    ChatInputProps & { attachments?: ImageAttachment[]; onRemoveAttachment?: (id: string) => void }
> = ({ placeholder, isLoading, canSend, onSend, onPickFiles, attachments = [], onRemoveAttachment }) => {
    const [localText, setLocalText] = useState("")
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    // Auto-resize textarea
    useLayoutEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "24px"
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px"
        }
    }, [localText])

    const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = useCallback(
        (event) => {
            if (event.nativeEvent && (event.nativeEvent as unknown as { isComposing?: boolean }).isComposing) return
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault()
                if (localText.trim().length > 0 || attachments.length > 0) {
                    onSend(localText)
                    setLocalText("")
                    textAreaRef.current?.focus()
                }
            }
        },
        [localText, onSend, attachments.length]
    )

    const sendClick = useCallback(() => {
        if (localText.trim().length > 0 || attachments.length > 0) {
            onSend(localText)
            setLocalText("")
            textAreaRef.current?.focus()
        }
    }, [localText, onSend, attachments.length])

    const handleFilePick = useCallback(() => {
        fileInputRef.current?.click()
    }, [])

    const handleFileChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onPickFiles(event.target.files)
            event.target.value = ""
        },
        [onPickFiles]
    )

    return (
        <Stack spacing={1} sx={{ width: "100%" }}>
            {/* Превью прикреплённых изображений */}
            {attachments.length > 0 && (
                <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 1, pt: 0.5 }}>
                    {attachments.map((a) => (
                        <Box
                            key={a.id}
                            sx={{
                                position: "relative",
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                overflow: "hidden",
                                boxShadow: 1,
                            }}
                        >
                            <img
                                src={a.url}
                                alt="attachment"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                            {onRemoveAttachment && (
                                <IconButton
                                    size="small"
                                    sx={{ position: "absolute", top: 2, right: 2, bgcolor: "background.paper", p: 0.5 }}
                                    onClick={() => onRemoveAttachment(a.id)}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            )}
                        </Box>
                    ))}
                </Stack>
            )}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 1.5,
                    bgcolor: "background.paper",
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "divider",
                    px: 2,
                    py: 1,
                    width: "100%",
                    minHeight: "44px",
                    maxHeight: "120px",
                    overflow: "hidden",
                }}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />
                <IconButton
                    size="small"
                    onClick={handleFilePick}
                    disabled={isLoading}
                    sx={{ color: "text.secondary", flexShrink: 0 }}
                >
                    <AttachFileIcon fontSize="small" />
                </IconButton>
                <Box sx={{ flex: 1, display: "flex", alignItems: "flex-start", overflow: "hidden" }}>
                    <textarea
                        ref={textAreaRef}
                        value={localText}
                        onChange={(e) => setLocalText(e.currentTarget.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        disabled={isLoading}
                        rows={1}
                        style={{
                            width: "100%",
                            border: "none",
                            outline: "none",
                            background: "transparent",
                            resize: "none",
                            font: "inherit",
                            fontSize: "15px",
                            lineHeight: 1.5,
                            padding: 0,
                            margin: 0,
                            display: "block",
                            maxHeight: "100px",
                            overflowY: "auto",
                        }}
                    />
                </Box>
                <IconButton
                    size="small"
                    color="secondary"
                    onClick={sendClick}
                    disabled={isLoading || (!canSend && localText.trim().length === 0)}
                    sx={{
                        color: localText.trim().length > 0 ? "primary.secondary" : "text.primary",
                        flexShrink: 0,
                    }}
                >
                    <SendIcon fontSize="small" />
                </IconButton>
            </Box>
        </Stack>
    )
}
