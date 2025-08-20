import { agentApi as api } from "./agent_injection"

export type AgentMessage = {
    role: "user" | "assistant" | "system"
    content: string
}

export type AgentChatRequest = {
    message: string
    history?: AgentMessage[]
    context?: Record<string, unknown>
}

export type AgentChatResponse = {
    reply: string
    history?: AgentMessage[]
    meta?: Record<string, unknown>
}

export const injectedAgentApi = api.injectEndpoints({
    endpoints: (build) => ({
        chatAgentV1ChatPost: build.mutation<AgentChatResponse, AgentChatRequest>({
            query: (body) => ({
                url: `/agent/v1/chat`,
                method: "POST",
                body,
            }),
        }),
    }),
    overrideExisting: false,
})

export const { useChatAgentV1ChatPostMutation } = injectedAgentApi
