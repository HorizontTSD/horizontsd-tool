import type { Meta, StoryObj } from "@storybook/react";
import { AppProvider } from "@/app/providers";
import { Header } from "./index";
import { useColorScheme } from "@mui/material/styles";

const meta: Meta<typeof Header> = {
  title: "Components/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    title: {
      control: "text",
      description: "Заголовок в шапке",
      defaultValue: "FORECAST",
    },
    copyright: {
      control: "text",
      description: "Текст копирайта",
      defaultValue: "© 2025 Horizon TSD",
    },
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "Цветовая тема",
      defaultValue: "light",
    },
    language: {
      control: "select",
      options: ["ru", "en", "it"],
      description: "Язык интерфейса",
      defaultValue: "ru",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    title: "FORECAST",
    copyright: "© 2025 Horizon TSD",
    theme: "light",
    language: "ru",
  },
  decorators: [
    (Story, context) => {
      const { theme, language } = context.args;
      return (
        <AppProvider initialTheme={theme} initialLanguage={language}>
          <Story />
        </AppProvider>
      );
    },
  ],
};

export const Sm: Story = {
  decorators: [
    (Story) => {
      return (
        <AppProvider>
          <div style={{ width: "600px" }}>
            <Story />
          </div>
        </AppProvider>
      );
    },
  ],
};

export const Md: Story = {
  decorators: [
    (Story) => {
      return (
        <AppProvider>
          <div style={{ width: "900px" }}>
            <Story />
          </div>
        </AppProvider>
      );
    },
  ],
};

export const Xl: Story = {
  decorators: [
    (Story) => {
      return (
        <AppProvider>
          <div style={{ width: "1200px" }}>
            <Story />
          </div>
        </AppProvider>
      );
    },
  ],
};
