import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AppProvider } from '@/app/providers';
import { Metrix } from "./index"

// https://storybook.js.org/docs/api/csf
const meta: Meta<typeof Metrix> = {
	title: 'Components/Metrix',
	component: Metrix,
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Metrix>;


export const MetrixStory: Story = {
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
		return <Metrix />
	}
};
