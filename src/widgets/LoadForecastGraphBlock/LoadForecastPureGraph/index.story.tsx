import React from 'react';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AppProvider } from '@/app/providers';
import { LoadForecastPureGraph } from "./index";
import {
	useFuncGetSensorIdListBackendV1GetSensorIdListGetQuery,
	useFuncGetForecastDataBackendV1GetForecastDataPostMutation
} from "@/shared/api/backend"

const meta: Meta<typeof LoadForecastPureGraph> = {
	title: 'Components/LoadForecastPureGraph',
	component: LoadForecastPureGraph,
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof LoadForecastPureGraph>;

export const LoadForecastPureGraphStory: Story = {
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
		const { data: sensorsList, error: sensorsList_error, isLoading: sensorsList_isLoading } = useFuncGetSensorIdListBackendV1GetSensorIdListGetQuery()
		const [sensorIds, setSensorIds] = useState<string>(sensorsList?.join(', ') || '');
		const [triggerForecast, { data, isLoading, error }] = useFuncGetForecastDataBackendV1GetForecastDataPostMutation();
		const handleSubmit = async (e: React.FormEvent) => {
			e.preventDefault();
			const idsArray = sensorIds.split(',').map(id => id.trim());
			try {
				await triggerForecast({
					forecastData: {
						sensor_ids: idsArray
					}
				}).unwrap();
			} catch (err) {
				console.error('Failed to fetch forecast:', err);
			}
		};

		return <div>
			<div>
				<h2>Sensor IDs</h2>
				{
					sensorsList_isLoading ? <div>Loading...</div> :
						sensorsList_error ? <div>Error loading sensors!</div> :
							<ul>
								{sensorsList?.map((sensorId) => (
									<li key={sensorId}>{sensorId}</li>
								))}
							</ul>
				}
			</div>
			<div>
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						value={sensorIds}
						onChange={(e) => setSensorIds(e.target.value)}
						placeholder="Enter sensor IDs (comma-separated)"
					/>
					<button type="submit" disabled={isLoading}>
						{isLoading ? 'Loading...' : 'Get Forecast'}
					</button>
				</form>
				{error && (
					<div style={{ color: 'red' }}>
						Error: {'data' in error ? error.data.detail : 'Unknown error'}
					</div>
				)}
				{data && (
					<div>
						<h2>Forecast Data:</h2>
						{data.map((e, i) => {
							const item = Object.values(e)[0]
							return (
								<LoadForecastPureGraph key={item.description.sensor_id} initialData={item} />
							)
						})}
					</div>
				)}
			</div>
		</div>
	}
};
