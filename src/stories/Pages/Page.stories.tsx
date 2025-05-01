import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { store } from '@/store';
import { AppTheme } from '@/theme';
import {
  chartsCustomizations,
  treeViewCustomizations,
  loaderCustomizations,
} from '@/theme';
import { HomePage } from '@/pages/HomePage';

const xThemeComponents = {
  ...chartsCustomizations,
  ...treeViewCustomizations,
  ...loaderCustomizations,
};


const meta = {
  title: 'Example/Page',
  component: HomePage,
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: `${import.meta.env.VITE_FIGMA_URL}`
    }
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Provider store={store}>
          <AppTheme themeComponents={xThemeComponents}>
            <CssBaseline enableColorScheme />
            <Story />
          </AppTheme>
        </Provider>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof HomePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};