import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    '../src/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  "addons": [
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-mdx-gfm",
    "@storybook/addon-designs",
    "@storybook/experimental-addon-test",
    // '@storybook/addon-interactions'
  ],

  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },

  docs: {
    autodocs: true
  },

  typescript: {
    reactDocgen: "react-docgen-typescript"
  }
};
export default config;