import { MainLayout } from "@/shared/ui/Layout/MainLayout"
import { AiAgentContent } from "@/widgets/AiAgentContent"
import { useParams } from "react-router-dom"

export const AiAgentPage = () => {
    const { chatId } = useParams<{ chatId?: string }>()
    return (
        <MainLayout>
            <AiAgentContent initialChatId={chatId} />
        </MainLayout>
    )
}
