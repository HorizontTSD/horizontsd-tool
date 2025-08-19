import { model_fast_api as api } from "./model_fast_api_injection"
const injectedRtkApi = api.injectEndpoints({
    endpoints: (build) => ({
        predictModelFastApiV1PredictPost: build.mutation<
            PredictModelFastApiV1PredictPostApiResponse,
            PredictModelFastApiV1PredictPostApiArg
        >({
            query: (queryArg) => ({
                url: `/model_fast_api/v1/predict`,
                method: "POST",
                body: queryArg.predictRequest,
            }),
        }),
        predictModelFastApiV1PredictXgbPost: build.mutation<
            PredictModelFastApiV1PredictXgbPostApiResponse,
            PredictModelFastApiV1PredictXgbPostApiArg
        >({
            query: (queryArg) => ({
                url: `/model_fast_api/v1/predict_xgb`,
                method: "POST",
                body: queryArg.predictRequest,
            }),
        }),
        updateModelApiModelFastApiV1UpdateModelPost: build.mutation<
            UpdateModelApiModelFastApiV1UpdateModelPostApiResponse,
            UpdateModelApiModelFastApiV1UpdateModelPostApiArg
        >({
            query: () => ({ url: `/model_fast_api/v1/update_model`, method: "POST" }),
        }),
        updateColForTrainLstmRequestBackendV1UpdateColForTrainLstmPost: build.mutation<
            UpdateColForTrainLstmRequestBackendV1UpdateColForTrainLstmPostApiResponse,
            UpdateColForTrainLstmRequestBackendV1UpdateColForTrainLstmPostApiArg
        >({
            query: (queryArg) => ({
                url: `/api/v1/update_col_for_train_lstm`,
                method: "POST",
                body: queryArg.updateColRequest,
            }),
        }),
        funcGetForecastDataBackendV1GetForecastDataPost: build.mutation<
            FuncGetForecastDataBackendV1GetForecastDataPostApiResponse,
            FuncGetForecastDataBackendV1GetForecastDataPostApiArg
        >({
            query: (queryArg) => ({
                url: `/api/v1/get_forecast_data`,
                method: "POST",
                body: queryArg.forecastData,
            }),
        }),
        funcGetMiniChartsDataBackendV1GetMiniChartsDataGet: build.query<
            FuncGetMiniChartsDataBackendV1GetMiniChartsDataGetApiResponse,
            FuncGetMiniChartsDataBackendV1GetMiniChartsDataGetApiArg
        >({
            query: () => ({ url: `/api/v1/get_mini_charts_data` }),
        }),
        funcGetSensorIdListBackendV1GetSensorIdListGet: build.query<
            FuncGetSensorIdListBackendV1GetSensorIdListGetApiResponse,
            FuncGetSensorIdListBackendV1GetSensorIdListGetApiArg
        >({
            query: () => ({ url: `/api/v1/get_sensor_id_list` }),
        }),
        funcFetchPossibleDateForMetriBackendV1FetchPossibleDateForMetrixPost: build.mutation<
            FuncFetchPossibleDateForMetriBackendV1FetchPossibleDateForMetrixPostApiResponse,
            FuncFetchPossibleDateForMetriBackendV1FetchPossibleDateForMetrixPostApiArg
        >({
            query: (queryArg) => ({
                url: `/api/v1/fetch_possible_date_for_metrix`,
                method: "POST",
                body: queryArg.forecastData,
            }),
        }),
        funcMetrixByPeriodBackendV1MetrixByPeriodPost: build.mutation<
            FuncMetrixByPeriodBackendV1MetrixByPeriodPostApiResponse,
            FuncMetrixByPeriodBackendV1MetrixByPeriodPostApiArg
        >({
            query: (queryArg) => ({
                url: `/api/v1/accuracy_by_period`,
                method: "POST",
                body: queryArg.metrixByPeriod,
            }),
        }),
        readRootGet: build.query<ReadRootGetApiResponse, ReadRootGetApiArg>({
            query: () => ({ url: `/` }),
        }),
    }),
    overrideExisting: false,
})
export { injectedRtkApi as model_fast_api }
export type PredictModelFastApiV1PredictPostApiResponse = /** status 200 Successful Response */ any
export type PredictModelFastApiV1PredictPostApiArg = {
    predictRequest: PredictRequest
}
export type PredictModelFastApiV1PredictXgbPostApiResponse = /** status 200 Successful Response */ any
export type PredictModelFastApiV1PredictXgbPostApiArg = {
    predictRequest: PredictRequest
}
export type UpdateModelApiModelFastApiV1UpdateModelPostApiResponse = /** status 200 Successful Response */ any
export type UpdateModelApiModelFastApiV1UpdateModelPostApiArg = void
export type UpdateColForTrainLstmRequestBackendV1UpdateColForTrainLstmPostApiResponse =
    /** status 200 Successful Response */ any
export type UpdateColForTrainLstmRequestBackendV1UpdateColForTrainLstmPostApiArg = {
    updateColRequest: UpdateColRequest
}
export type FuncGetForecastDataBackendV1GetForecastDataPostApiResponse = /** status 200 Successful Response */ any
export type FuncGetForecastDataBackendV1GetForecastDataPostApiArg = {
    forecastData: ForecastData
}
export type FuncGetMiniChartsDataBackendV1GetMiniChartsDataGetApiResponse = /** status 200 Successful Response */ any
export type FuncGetMiniChartsDataBackendV1GetMiniChartsDataGetApiArg = void
export type FuncGetSensorIdListBackendV1GetSensorIdListGetApiResponse = /** status 200 Successful Response */ any
export type FuncGetSensorIdListBackendV1GetSensorIdListGetApiArg = void
export type FuncFetchPossibleDateForMetriBackendV1FetchPossibleDateForMetrixPostApiResponse =
    /** status 200 Successful Response */ any
export type FuncFetchPossibleDateForMetriBackendV1FetchPossibleDateForMetrixPostApiArg = {
    forecastData: ForecastData
}
export type FuncMetrixByPeriodBackendV1MetrixByPeriodPostApiResponse = /** status 200 Successful Response */ any
export type FuncMetrixByPeriodBackendV1MetrixByPeriodPostApiArg = {
    metrixByPeriod: MetrixByPeriod
}
export type ReadRootGetApiResponse = /** status 200 Successful Response */ any
export type ReadRootGetApiArg = void
export type ValidationError = {
    loc: (string | number)[]
    msg: string
    type: string
}
export type HttpValidationError = {
    detail?: ValidationError[]
}
export type PredictRequest = {
    count_time_points_predict: number
}
export type UpdateColRequest = {
    col_for_train: string[]
}
export type ForecastData = {
    sensor_ids: string[]
}
export type MetrixByPeriod = {
    sensor_ids: string[]
    date_start: string
    date_end: string
}
export const {
    usePredictModelFastApiV1PredictPostMutation,
    usePredictModelFastApiV1PredictXgbPostMutation,
    useUpdateModelApiModelFastApiV1UpdateModelPostMutation,
    useUpdateColForTrainLstmRequestBackendV1UpdateColForTrainLstmPostMutation,
    useFuncGetForecastDataBackendV1GetForecastDataPostMutation,
    useFuncGetMiniChartsDataBackendV1GetMiniChartsDataGetQuery,
    useFuncGetSensorIdListBackendV1GetSensorIdListGetQuery,
    useFuncFetchPossibleDateForMetriBackendV1FetchPossibleDateForMetrixPostMutation,
    useFuncMetrixByPeriodBackendV1MetrixByPeriodPostMutation,
    useReadRootGetQuery,
} = injectedRtkApi
