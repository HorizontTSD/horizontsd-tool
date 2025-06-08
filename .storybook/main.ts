import type { StorybookConfig } from "@storybook/react-vite"
import { mergeConfig, loadEnv } from "vite"

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)", "../src/**/*.story.@(js|jsx|ts|tsx)"],
    addons: [
        "@storybook/addon-essentials",
        "@chromatic-com/storybook",
        "@storybook/addon-designs",
        "@storybook/experimental-addon-test",
    ],
    framework: {
        name: "@storybook/react-vite",
        options: {
            strictMode: false,
        },
    },
    docs: {
        autodocs: true,
    },
    typescript: {
        reactDocgen: "react-docgen-typescript",
    },
    staticDirs: ["../public"],
    async viteFinal(config, { configType }) {
        // Load env variables based on mode
        const env = loadEnv(configType.toLowerCase(), process.cwd(), "")
        
        return mergeConfig(config, {
            define: {
                "process.env": {
                    VITE_BACKEND_ENDPOINT: env.VITE_BACKEND_ENDPOINT,
                    VITE_ALERT_ENDPOINT: env.VITE_ALERT_ENDPOINT,
                    VITE_MODEL_FAST_API_ENDPOINT: env.VITE_MODEL_FAST_API_ENDPOINT,
                }
            }
        })
    },
}

export default config