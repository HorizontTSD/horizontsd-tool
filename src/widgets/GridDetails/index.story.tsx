import React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { AppProvider } from "@/app/providers"
import { CustomizedDataGrid } from "./index"

import { handlers } from "@/mocks/handlers"

const meta: Meta<typeof CustomizedDataGrid> = {
    title: "Components/GridDetails",
    component: CustomizedDataGrid,
    tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof CustomizedDataGrid>

export const CustomizedDataGridStory: Story = {
    parameters: {
        msw: {
            handlers,
        },
    },
    decorators: [
        (Story) => {
            return (
                <AppProvider>
                    <Story />
                </AppProvider>
            )
        },
    ],
    render: () => {
        // local, global
        return <CustomizedDataGrid />
    },
}
