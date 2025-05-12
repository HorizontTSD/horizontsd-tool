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
      description: "Main title text in the header",
      defaultValue: "FORECAST",
    },
    copyright: {
      control: "text",
      description: "Copyright text displayed in the header",
      defaultValue: "© 2025 Horizon TSD",
    },
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "Color theme of the header",
      defaultValue: "light",
    },
    language: {
      control: "select",
      options: ["ru", "en", "it"],
      description: "Interface language",
      defaultValue: "ru",
    },
    width: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "Width breakpoint",
      defaultValue: "xl",
    },
    height: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "Height breakpoint",
      defaultValue: "md",
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
    width: "xl",
    height: "md",
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

export const ExtraSmall: Story = {
  args: {
    ...Default.args,
    width: "xs",
    height: "xs",
  },
  decorators: Default.decorators,
};

export const Small: Story = {
  args: {
    ...Default.args,
    width: "sm",
    height: "sm",
  },
  decorators: Default.decorators,
};

export const Medium: Story = {
  args: {
    ...Default.args,
    width: "md",
    height: "md",
  },
  decorators: Default.decorators,
};

export const Large: Story = {
  args: {
    ...Default.args,
    width: "lg",
    height: "lg",
  },
  decorators: Default.decorators,
};

export const ExtraLarge: Story = {
  args: {
    ...Default.args,
    width: "xl",
    height: "xl",
  },
  decorators: Default.decorators,
};
