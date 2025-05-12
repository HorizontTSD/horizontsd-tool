import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AppProvider } from '@/app/providers';
import { Metrix } from "./index"

import { handlers } from '@/mocks/handlers';

// https://storybook.js.org/docs/api/csf
const meta: Meta<typeof Metrix> = {
	title: 'Components/Metrix',
	component: Metrix,
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Metrix>;


export const MetrixStory: Story = {
	parameters: {
		msw: {
			handlers
		}
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
	render: (local, global) => {
		fetch(`/backend/v1/get_sensor_id_list`).then(e => e.json()).then(console.log)
		return <Metrix />
	}
};
