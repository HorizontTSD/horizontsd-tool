import React from "react"

export interface AgentMessage {
    role: "user" | "assistant" | "system"
    content: string
}

export interface Conversation {
    id: string
    title?: string
    messages: AgentMessage[]
}

export interface ImageAttachment {
    id: string
    file: File
    url: string
}

export interface ChatMessageProps {
    message: AgentMessage
    index: number
    selectedId: string | null
    isEditing: boolean
    editingText: string
    onEdit: (text: string) => void
    onStartEdit: (index: number) => void
    onSaveEdit: (index: number) => void
    onCancelEdit: () => void
    onCopy: (text: string) => void
    onRegenerate: (index: number) => void
}

export interface ChatInputProps {
    placeholder: string
    isLoading: boolean
    canSend: boolean
    onSend: (text: string) => void
    onPickFiles: (files: FileList | null) => void
}

export interface AttachmentsPreviewProps {
    attachments: ImageAttachment[]
    onRemove: (id: string) => void
}

export interface MessagesListProps {
    messages: AgentMessage[]
    selectedId: string | null
    isLoading: boolean
    messagesRef: React.RefObject<HTMLDivElement | null>
    onScroll: () => void
    editingMessageId: string | null
    editingText: string
    setEditingText: (v: string) => void
    startEditMessage: (idx: number) => void
    saveEditMessage: (idx: number) => void
    cancelEditMessage: () => void
    copyToClipboard: (t: string) => void
    regenerateLastAssistant: (idx: number) => void
}

export interface DebugBannerProps {
    onClose: () => void
}

export interface AiAgentContentProps {
    initialChatId?: string
}
