import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig, loadEnv } from "vite";

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)",
    "../src/**/*.story.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-designs",
    "@storybook/experimental-addon-test",
    // '@storybook/addon-interactions'
  ],

  framework: {
    name: "@storybook/react-vite",
    options: {
      strictMode: false,
    },
  },
  env: (config) => ({
    ...config,
    VITE_BACKEND: `http://localhost:6006`,
  }),

  docs: {
    autodocs: true,
  },

  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
  staticDirs: ["../public"],
};
export default config;
