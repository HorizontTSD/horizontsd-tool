import { http, HttpResponse } from 'msw'

const API_URL = import.meta.env.VITE_BACKEND;

export const handlers = [
	http.get(`${API_URL}/backend/v1/get_mini_charts_data`, () => {
		const now = Date.now()
		const yesterday = now - (24 * 60 * 60 * 1000)
		return HttpResponse.json([
			{
				"title": {
					"en": "Temperature",
					"ru": "Температура",
					"zh": "温度",
					"it": "Temperatura",
					"fr": "Température",
					"de": "Temperatur"
				},
				"values": "+22.9°C",
				"description": {
					"en": "The last 24 hours",
					"ru": "Последние 24 часа",
					"zh": "过去24小时",
					"it": "Le ultime 24 ore",
					"fr": "Les dernières 24 heures",
					"de": "Die letzten 24 Stunden"
				},
				"percentages": {
					"value": 86.19,
					"mark": "negative"
				},
				"data": Array.from(new Array(24)).map((_, index) => {

					return {
						"datetime": yesterday + (index * 1000 * 60 * 60),
						"value": index * Math.random()
					}
				}),
			},
			{
				"title": {
					"en": "Wind speed",
					"ru": "Скорость ветра",
					"zh": "风速",
					"it": "Velocità del vento",
					"fr": "Vitesse du vent",
					"de": "Windgeschwindigkeit"
				},
				"values": "5.29km/h",
				"description": {
					"en": "The last 24 hours",
					"ru": "Последние 24 часа",
					"zh": "过去24小时",
					"it": "Le ultime 24 ore",
					"fr": "Les dernières 24 heures",
					"de": "Die letzten 24 Stunden"
				},
				"percentages": {
					"value": 24.11,
					"mark": "positive"
				},
				"data": Array.from(new Array(24)).map((_, index) => {
					return {
						"datetime": yesterday + (index * 1000 * 60 * 60),
						"value": index * Math.random()
					}
				}),
			},
			{
				"title": {
					"en": "Humidity",
					"ru": "Влажность",
					"zh": "湿度",
					"it": "Umidità",
					"fr": "Humidité",
					"de": "Luftfeuchtigkeit"
				},
				"values": "56.42%",
				"description": {
					"en": "The last 24 hours",
					"ru": "Последние 24 часа",
					"zh": "过去24小时",
					"it": "Le ultime 24 ore",
					"fr": "Les dernières 24 heures",
					"de": "Die letzten 24 Stunden"
				},
				"percentages": {
					"value": 47.36,
					"mark": "negative"
				},
				"data": Array.from(new Array(24)).map((_, index) => {
					return {
						"datetime": yesterday + (index * 1000 * 60 * 60),
						"value": index * Math.random()
					}
				}),
			},
			{
				"title": {
					"en": "Pressure",
					"ru": "Давление",
					"zh": "气压",
					"it": "Pressione",
					"fr": "Pression",
					"de": "Druck"
				},
				"values": "26.62 inHg",
				"description": {
					"en": "The last 24 hours",
					"ru": "Последние 24 часа",
					"zh": "过去24小时",
					"it": "Le ultime 24 ore",
					"fr": "Les dernières 24 heures",
					"de": "Die letzten 24 Stunden"
				},
				"percentages": {
					"value": 32.6,
					"mark": "negative"
				},
				"data": Array.from(new Array(24)).map((_, index) => {
					return {
						"datetime": yesterday + (index * 1000 * 60 * 60),
						"value": index * Math.random()
					}
				}),
			}
		])
	}),

	http.get(`${API_URL}/backend/v1/get_sensor_id_list`, () => {
		return HttpResponse.json([
			"arithmetic_1464947681",
			"arithmetic_1464947681_2"
		])
	}),

	http.post<{ sensor_ids: string[] }>(
		'${API_URL}/backend/v1/fetch_possible_date_for_metrix',
		async ({ request }) => {
			const { sensor_ids } = await request.json();

			if (!Array.isArray(sensor_ids)) {
				return HttpResponse.json(
					{ error: 'sensor_ids must be an array' },
					{ status: 400 }
				);
			}

			const currentDate = new Date().toISOString();
			const yesterdayDate = new Date();
			yesterdayDate.setDate(yesterdayDate.getDate() - 1);
			const yesterdayISODate = yesterdayDate.toISOString();

			const response = {} as Record<string, {
				earliest_date: string;
				max_date: string;
				start_default_date: string;
				end_default_date: string;
			}>;

			sensor_ids.forEach(sensorId => {
				response[sensorId] = {
					earliest_date: "2025-02-21T12:10:00+00:00",
					max_date: currentDate,
					start_default_date: yesterdayISODate,
					end_default_date: currentDate
				};
			});

			return HttpResponse.json(response);
		}
	),

	http.post<{ sensor_ids: string[] }>(
		`${API_URL}/backend/v1/get_forecast_data`,
		async ({ request }) => {
			const { sensor_ids } = await request.json();

			if (!Array.isArray(sensor_ids)) {
				return HttpResponse.json(
					{ error: 'sensor_ids must be an array' },
					{ status: 400 }
				);
			}

			const response = {} as Record<string, {}>;

			sensor_ids.forEach(sensorId => {
				const today = Date.now()
				const yesterday = today - (24 * 60 * 60 * 1000)
				const range = 48 * 60 * 60 * 1000
				const data_frequency = 5 * 60 * 1000
				let last_real_data = 10_000
				response[sensorId] = {
					"description": {
						"sensor_name": sensorId + "_name",
						"sensor_id": sensorId
					},
					map_data: {
						"data": {
							"last_real_data": Array.from(new Array(((range / 2) / data_frequency))).map(
								(_, index) => {
									last_real_data = Math.sin(last_real_data) * 10000
									return {
										"datetime": yesterday + (index * data_frequency),
										"load_consumption": last_real_data
									}
								}
							),
							"actual_prediction_lstm": Array.from(new Array(((range / 2) / data_frequency))).map(
								(_, index) => {
									last_real_data = Math.sin(last_real_data) * 10000
									return {
										"datetime": today + (index * data_frequency),
										"load_consumption": last_real_data
									}
								}
							),
							"actual_prediction_xgboost": Array.from(new Array(((range / 2) / data_frequency))).map(
								(_, index) => {
									last_real_data = Math.sin(last_real_data) * 10000
									return {
										"datetime": today + (index * data_frequency),
										"load_consumption": last_real_data
									}
								}
							),
							"ensemble": Array.from(new Array(((range / 2) / data_frequency))).map(
								(_, index) => {
									last_real_data = Math.sin(last_real_data) * 10000
									return {
										"datetime": today + (index * data_frequency),
										"load_consumption": last_real_data
									}
								}
							)
						},
						"last_know_data": "2025-05-09 19:07:31",
						"legend": {
							"last_know_data_line": {
								"text": {
									"en": "Last known date",
									"ru": "Последняя известная дата",
									"zh": "最后已知日期",
									"it": "Ultima data conosciuta",
									"fr": "Dernière date connue",
									"de": "Letztes bekanntes Datum"
								},
								"color": "#A9A9A9"
							},
							"real_data_line": {
								"text": {
									"en": "Real data",
									"ru": "Реальные данные",
									"zh": "真实数据",
									"it": "Dati reali",
									"fr": "Données réelles",
									"de": "Echte Daten"
								},
								"color": "#0000FF"
							},
							"LSTM_data_line": {
								"text": {
									"en": "LSTM current forecast",
									"ru": "LSTM актуальный прогноз",
									"zh": "LSTM 当前预测",
									"it": "Previsione attuale LSTM",
									"fr": "Prévision actuelle LSTM",
									"de": "Aktuelle LSTM-Vorhersage"
								},
								"color": "#FFA500"
							},
							"XGBoost_data_line": {
								"text": {
									"en": "XGBoost current forecast",
									"ru": "XGBoost актуальный прогноз",
									"zh": "XGBoost 当前预测",
									"it": "Previsione attuale XGBoost",
									"fr": "Prévision actuelle XGBoost",
									"de": "Aktuelle XGBoost-Vorhersage"
								},
								"color": "#a7f3d0"
							},
							"Ensemble_data_line": {
								"text": {
									"en": "Ensemble forecast",
									"ru": "Ансамбль прогноз",
									"zh": "集成预测",
									"it": "Previsione dell'ensemble",
									"fr": "Prévision d'ensemble",
									"de": "Ensemble-Vorhersage"
								},
								"color": " #FFFF00"
							}
						}
					},
					"table_to_download": Array.from(new Array((range / data_frequency))).map(
						(_, index) => {
							last_real_data = Math.sin(last_real_data) * 10000
							return {
								"datetime": yesterday + (index * data_frequency),
								"XGBoost_predict": Math.sin(index * data_frequency) * 10000,
								"LSTM_predict": Math.sin(index * data_frequency) * 8000,
								"ensemble_predict": Math.sin(index * data_frequency) * 5000,
							}
						}
					),
					"metrix_tables": {
						"XGBoost": {
							"metrics_table": Array.from(new Array((range / data_frequency))).map(
								(_, index) => {
									last_real_data = Math.sin(last_real_data) * 10000
									return {
										"Time": yesterday + (index * data_frequency),
										"Actual load_consumption": Math.sin(index * data_frequency) * 10000,
										"XGBoost predicted": Math.sin(index * data_frequency) * 8000,
										"MAPE": Math.random(),
										"RMSE": Math.random(),
										"MAE": Math.random(),
									}
								}
							),
							"text": {
								"en": "Forecast accuracy metrics for XGBoost",
								"ru": "Метрики точности прогноза для XGBoost",
								"zh": "XGBoost 预测准确性指标",
								"it": "Metriche di accuratezza delle previsioni per XGBoost",
								"fr": "Métriques de précision des prévisions pour XGBoost",
								"de": "Prognosegenauigkeitsmetriken für XGBoost"
							}
						},
						"LSTM": {
							"metrics_table": Array.from(new Array((range / data_frequency))).map(
								(_, index) => {
									last_real_data = Math.sin(last_real_data) * 10000
									return {
										"Time": yesterday + (index * data_frequency),
										"Actual load_consumption": Math.sin(index * data_frequency) * 10000,
										"LSTM predicted": Math.sin(index * data_frequency) * 8000,
										"MAPE": Math.random(),
										"RMSE": Math.random(),
										"MAE": Math.random(),
									}
								}
							),
							"text": {
								"en": "Forecast accuracy metrics for LSTM",
								"ru": "Метрики точности прогноза для LSTM",
								"zh": "LSTM 预测准确性指标",
								"it": "Metriche di accuratezza delle previsioni per LSTM",
								"fr": "Métriques de précision des prévisions pour LSTM",
								"de": "Prognosegenauigkeitsmetriken für LSTM"
							}
						}
					}
				};
			});

			return HttpResponse.json([response]);
		}
	),

	http.post<{ sensor_ids: string[] }>(
		`${API_URL}/backend/v1/metrix_by_period`,
		async ({ request }) => {
			const {
				sensor_ids,
				date_start,
				date_end
			} = await request.json();

			if (!Array.isArray(sensor_ids)) {
				return HttpResponse.json(
					{ error: 'sensor_ids must be an array' },
					{ status: 400 }
				);
			}
			return HttpResponse.json(
				sensor_ids.map((e, i) => {
					return {
						"XGBoost": {
							"MAE": Math.random() * 10_000,
							"RMSE": Math.random() * 10_000,
							"R2": Math.random() * 10,
							"MAPE": Math.random() * 10,
						},
						"LSTM": {
							"MAE": Math.random() * 10_000,
							"RMSE": Math.random() * 10_000,
							"R2": Math.random() * 10,
							"MAPE": Math.random() * 10,
						}
					}
				})
			);
		}
	),
]
