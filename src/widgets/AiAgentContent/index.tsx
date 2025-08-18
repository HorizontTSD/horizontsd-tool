import React, { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { Stack, Box } from "@mui/material"
import { useTranslation } from "react-i18next"
import { useChatAgentV1ChatPostMutation } from "@/shared/api/agent"
import { DebugBanner } from "./DebugBanner"
import { MessagesList } from "./MessagesList"
import { AttachmentsPreview } from "./AttachmentsPreview"
import { ChatInput } from "./ChatInput"
import { AiAgentContentProps, Conversation, ImageAttachment, AgentMessage } from "./types"

const LS_KEY = "ai-agent-conversations"
const UPDATE_EVENT = "ai-agent-update"

const removeObjectUrlSafely = (url: string) => {
    try {
        URL.revokeObjectURL(url)
    } catch {
        // ignore
    }
}

export const AiAgentContent: React.FC<AiAgentContentProps> = ({ initialChatId }) => {
    const { t } = useTranslation()
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [attachments, setAttachments] = useState<ImageAttachment[]>([])
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
    const [editingText, setEditingText] = useState("")
    const [showInfo, setShowInfo] = useState(true)

    const messagesRef = useRef<HTMLDivElement | null>(null)
    const scrollPositionsRef = useRef<Record<string, number>>({})
    const lastLengthsRef = useRef<Record<string, number>>({})
    const sendingRef = useRef(false)

    const [chat, { isLoading }] = useChatAgentV1ChatPostMutation()

    const currentMessages = useMemo(() => {
        const conversation = conversations.find((c) => c.id === selectedId)
        return conversation?.messages || []
    }, [conversations, selectedId])

    const placeholder = t("widgets.aiAgent.inputPlaceholder")

    const loadFromStorage = useCallback(() => {
        try {
            const raw = localStorage.getItem(LS_KEY)
            const parsed = raw ? (JSON.parse(raw) as Conversation[]) : []
            setConversations(parsed)
        } catch {
            setConversations([])
        }
    }, [])

    const setConversationsSafely = useCallback((updater: (prev: Conversation[]) => Conversation[]) => {
        setConversations((prev) => {
            const next = updater(prev)
            const prevStr = JSON.stringify(prev)
            const nextStr = JSON.stringify(next)
            if (prevStr !== nextStr) {
                localStorage.setItem(LS_KEY, nextStr)
                window.dispatchEvent(new Event(UPDATE_EVENT))
            }
            return next
        })
    }, [])

    useEffect(() => {
        loadFromStorage()
    }, [loadFromStorage])

    useEffect(() => {
        if (initialChatId) {
            const exists = conversations.some((c) => c.id === initialChatId)
            if (!exists) {
                setConversationsSafely((prev) => [...prev, { id: initialChatId, messages: [] }])
            }
            setSelectedId(initialChatId)
        } else if (conversations.length > 0) {
            setSelectedId(conversations[0].id)
        }
    }, [initialChatId, conversations, setConversationsSafely])

    useEffect(() => {
        const handler = () => loadFromStorage()
        window.addEventListener("storage", handler)
        return () => window.removeEventListener("storage", handler)
    }, [loadFromStorage])

    // Scroll position management
    const handleScroll = useCallback(() => {
        if (selectedId && messagesRef.current) {
            scrollPositionsRef.current[selectedId] = messagesRef.current.scrollTop
        }
    }, [selectedId])

    useEffect(() => {
        if (selectedId && messagesRef.current) {
            const savedPosition = scrollPositionsRef.current[selectedId]
            if (savedPosition !== undefined) {
                messagesRef.current.scrollTop = savedPosition
            }
        }
    }, [selectedId])

    useEffect(() => {
        if (selectedId && messagesRef.current) {
            const currentLength = currentMessages.length
            const lastLength = lastLengthsRef.current[selectedId] || 0
            if (currentLength > lastLength) {
                messagesRef.current.scrollTop = messagesRef.current.scrollHeight
            }
            lastLengthsRef.current[selectedId] = currentLength
        }
    }, [currentMessages.length, selectedId])

    const onPickFiles = useCallback((files: FileList | null) => {
        if (!files) return
        const newAttachments: ImageAttachment[] = Array.from(files).map((file) => ({
            id: crypto.randomUUID(),
            file,
            url: URL.createObjectURL(file),
        }))
        setAttachments((prev) => [...prev, ...newAttachments])
    }, [])

    const removeAttachment = useCallback((id: string) => {
        setAttachments((prev) => {
            const attachment = prev.find((a) => a.id === id)
            if (attachment) {
                removeObjectUrlSafely(attachment.url)
            }
            return prev.filter((a) => a.id !== id)
        })
    }, [])

    const clearAttachments = useCallback((keepUrls: string[] = []) => {
        setAttachments((prev) => {
            prev.forEach((a) => {
                if (!keepUrls.includes(a.url)) {
                    removeObjectUrlSafely(a.url)
                }
            })
            return []
        })
    }, [])

    const handleSend = useCallback(
        async (textToSend: string) => {
            if (sendingRef.current) return
            sendingRef.current = true

            let chatId = selectedId
            try {
                if (!chatId) {
                    chatId = crypto.randomUUID()
                    setConversationsSafely((prev) => [...prev, { id: chatId!, messages: [] }])
                    setSelectedId(chatId)
                }

                const imageUrls = attachments.map((a) => a.url)
                const contentWithImages =
                    imageUrls.length > 0
                        ? textToSend + "\n" + imageUrls.map((url) => `image://${url}`).join("\n")
                        : textToSend

                // Add user message optimistically
                setConversationsSafely((prev) => {
                    const conversation = prev.find((c) => c.id === chatId)
                    if (!conversation) return prev

                    const newMessage: AgentMessage = { role: "user", content: contentWithImages }
                    const updatedMessages = [...conversation.messages, newMessage]

                    // Auto-generate title from first message
                    const title =
                        conversation.messages.length === 0
                            ? textToSend.slice(0, 50) + (textToSend.length > 50 ? "..." : "")
                            : conversation.title

                    return prev.map((c) => (c.id === chatId ? { ...c, messages: updatedMessages, title } : c))
                })

                // Prepare history for API
                const conversation = conversations.find((c) => c.id === chatId)
                const historyForApi = conversation?.messages || []
                const newUserMessage: AgentMessage = { role: "user", content: textToSend }
                const fullHistory = [...historyForApi, newUserMessage]

                // Call API
                const result = await chat({ message: textToSend, history: fullHistory }).unwrap()

                // Add assistant response
                setConversationsSafely((prev) => {
                    const conversation = prev.find((c) => c.id === chatId)
                    if (!conversation) return prev

                    const assistantMessage: AgentMessage = { role: "assistant", content: result.reply }
                    const updatedMessages = [...conversation.messages, assistantMessage]

                    return prev.map((c) => (c.id === chatId ? { ...c, messages: updatedMessages } : c))
                })

                clearAttachments(imageUrls)
            } catch {
                // Add error as assistant message
                if (chatId) {
                    setConversationsSafely((prev) => {
                        const conversation = prev.find((c) => c.id === chatId)
                        if (!conversation) return prev

                        const errorMessage: AgentMessage = {
                            role: "assistant",
                            content: t("widgets.aiAgent.backendError"),
                        }
                        const updatedMessages = [...conversation.messages, errorMessage]

                        return prev.map((c) => (c.id === chatId ? { ...c, messages: updatedMessages } : c))
                    })
                }

                clearAttachments()
            } finally {
                sendingRef.current = false
            }
        },
        [attachments, chat, selectedId, conversations, t, clearAttachments, setConversationsSafely]
    )

    const copyToClipboard = useCallback((text: string) => {
        navigator.clipboard.writeText(text).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement("textarea")
            textArea.value = text
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand("copy")
            document.body.removeChild(textArea)
        })
    }, [])

    const startEditMessage = useCallback(
        (idx: number) => {
            if (selectedId) {
                const conversation = conversations.find((c) => c.id === selectedId)
                const message = conversation?.messages[idx]
                if (message && message.role === "user") {
                    setEditingMessageId(`${selectedId}-${idx}`)
                    setEditingText(message.content.replace(/image:\/\/[^\n]*\n?/g, "").trim())
                }
            }
        },
        [selectedId, conversations]
    )

    const cancelEditMessage = useCallback(() => {
        setEditingMessageId(null)
        setEditingText("")
    }, [])

    const saveEditMessage = useCallback(
        (idx: number) => {
            if (selectedId && editingText.trim()) {
                setConversationsSafely((prev) => {
                    const conversation = prev.find((c) => c.id === selectedId)
                    if (!conversation) return prev

                    const updatedMessages = [...conversation.messages]
                    updatedMessages[idx] = { role: "user", content: editingText.trim() }

                    return prev.map((c) => (c.id === selectedId ? { ...c, messages: updatedMessages } : c))
                })
            }
            setEditingMessageId(null)
            setEditingText("")
        },
        [selectedId, editingText, setConversationsSafely]
    )

    const regenerateLastAssistant = useCallback(
        async (idx: number) => {
            if (sendingRef.current || !selectedId) return
            sendingRef.current = true

            try {
                const conversation = conversations.find((c) => c.id === selectedId)
                if (!conversation) return

                // Find the last user message before this assistant message
                const userMessageIndex = conversation.messages
                    .slice(0, idx)
                    .map((m, i) => ({ message: m, index: i }))
                    .filter(({ message }) => message.role === "user")
                    .pop()

                if (!userMessageIndex) return

                const userMessage = userMessageIndex.message
                const historyForApi = conversation.messages.slice(0, userMessageIndex.index)

                // Call API
                const result = await chat({
                    message: userMessage.content.replace(/image:\/\/[^\n]*\n?/g, "").trim(),
                    history: historyForApi,
                }).unwrap()

                // Update assistant message
                setConversationsSafely((prev) => {
                    const conversation = prev.find((c) => c.id === selectedId)
                    if (!conversation) return prev

                    const updatedMessages = [...conversation.messages]
                    updatedMessages[idx] = { role: "assistant", content: result.reply }

                    return prev.map((c) => (c.id === selectedId ? { ...c, messages: updatedMessages } : c))
                })
            } catch {
                // Update with error message
                setConversationsSafely((prev) => {
                    const conversation = prev.find((c) => c.id === selectedId)
                    if (!conversation) return prev

                    const updatedMessages = [...conversation.messages]
                    updatedMessages[idx] = {
                        role: "assistant",
                        content: t("widgets.aiAgent.backendError"),
                    }

                    return prev.map((c) => (c.id === selectedId ? { ...c, messages: updatedMessages } : c))
                })
            } finally {
                sendingRef.current = false
            }
        },
        [selectedId, conversations, chat, t, setConversationsSafely]
    )

    return (
        <Stack direction="row" sx={{ height: "calc(100vh - 64px)", width: "100%", overflow: "hidden" }}>
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1, p: 2 }}>
                {showInfo && <DebugBanner onClose={() => setShowInfo(false)} />}

                <MessagesList
                    messages={currentMessages}
                    selectedId={selectedId}
                    isLoading={isLoading}
                    messagesRef={messagesRef}
                    onScroll={handleScroll}
                    editingMessageId={editingMessageId}
                    editingText={editingText}
                    setEditingText={setEditingText}
                    startEditMessage={startEditMessage}
                    saveEditMessage={saveEditMessage}
                    cancelEditMessage={cancelEditMessage}
                    copyToClipboard={copyToClipboard}
                    regenerateLastAssistant={regenerateLastAssistant}
                />

                <AttachmentsPreview attachments={attachments} onRemove={removeAttachment} />

                <ChatInput
                    placeholder={placeholder}
                    isLoading={isLoading}
                    canSend={attachments.length > 0}
                    onSend={handleSend}
                    onPickFiles={onPickFiles}
                />
            </Box>
        </Stack>
    )
}
