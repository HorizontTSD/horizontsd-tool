import type { Meta, StoryObj } from "@storybook/react"
// import { http, HttpResponse, delay } from "msw"
import { AppProvider } from "@/app/providers"
import { App } from "@/app"

import { handlers } from "@/mocks/handlers"

const meta = {
    title: "Application/App",
    component: App,
} satisfies Meta<typeof App>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    parameters: {
        layout: "fullscreen",
        design: {
            type: "figma",
            url: `${import.meta.env.VITE_FIGMA_URL}`,
        },
        msw: {
            handlers,
        },
    },
    loaders: [
        async () => ({
            mocked: await (await fetch("/backend/v1/get_mini_charts_data")).json(),
        }),
    ],
    decorators: [
        (Story, Globals) => {
            // mocked server
            console.log(`Globals.loaded.mocked: `, Globals.loaded.mocked)
            fetch("/backend/v1/get_mini_charts_data")
                .then((e) => e.json())
                .then((e) => console.log(`fetch: `, e))
            return (
                <AppProvider>
                    <App />
                </AppProvider>
            )
        },
    ],
}
