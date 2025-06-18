import { backend as api } from "./backend_injection"
const injectedRtkApi = api.injectEndpoints({
    endpoints: (build) => ({
        getConceptsBackendV1AnalyticsdfsPost: build.mutation<
            GetConceptsBackendV1AnalyticsdfsPostApiResponse,
            GetConceptsBackendV1AnalyticsdfsPostApiArg
        >({
            query: (queryArg) => ({
                url: `/backend/v1/analyticsdfs`,
                method: "POST",
                body: queryArg.analyticsDFsRequest,
            }),
        }),
        getConceptsBackendV1ForecastPost: build.mutation<
            GetConceptsBackendV1ForecastPostApiResponse,
            GetConceptsBackendV1ForecastPostApiArg
        >({
            query: (queryArg) => ({
                url: `/backend/v1/forecast`,
                method: "POST",
                body: queryArg.forecastRequest,
            }),
        }),
        getConceptsBackendV1ForecastXgBoostPost: build.mutation<
            GetConceptsBackendV1ForecastXgBoostPostApiResponse,
            GetConceptsBackendV1ForecastXgBoostPostApiArg
        >({
            query: (queryArg) => ({
                url: `/backend/v1/forecast_XGBoost`,
                method: "POST",
                body: queryArg.forecastRequestXgBoost,
            }),
        }),
        getMetrixAllBackendV1AllMetrixPost: build.mutation<
            GetMetrixAllBackendV1AllMetrixPostApiResponse,
            GetMetrixAllBackendV1AllMetrixPostApiArg
        >({
            query: (queryArg) => ({
                url: `/backend/v1/all_metrix`,
                method: "POST",
                body: queryArg.menrixAllRequest,
            }),
        }),
        lstmForecastBackendV1LstmForecastPost: build.mutation<
            LstmForecastBackendV1LstmForecastPostApiResponse,
            LstmForecastBackendV1LstmForecastPostApiArg
        >({
            query: (queryArg) => ({
                url: `/backend/v1/LSTM_forecast`,
                method: "POST",
                body: queryArg.forecastRequestXgBoost,
            }),
        }),
        requestForecastNeuralNetworksBackendV1ForecastNeuralNetworksPost: build.mutation<
            RequestForecastNeuralNetworksBackendV1ForecastNeuralNetworksPostApiResponse,
            RequestForecastNeuralNetworksBackendV1ForecastNeuralNetworksPostApiArg
        >({
            query: (queryArg) => ({
                url: `/backend/v1/forecast_neural_networks`,
                method: "POST",
                body: queryArg.forecastRequestNeuralNetworks,
            }),
        }),
        getVectorizationBackendV1NormalizationPost: build.mutation<
            GetVectorizationBackendV1NormalizationPostApiResponse,
            GetVectorizationBackendV1NormalizationPostApiArg
        >({
            query: (queryArg) => ({
                url: `/backend/v1/normalization`,
                method: "POST",
                body: queryArg.normalizationRequest,
            }),
        }),
        getReverseVectorizationBackendV1ReverseNormalizationPost: build.mutation<
            GetReverseVectorizationBackendV1ReverseNormalizationPostApiResponse,
            GetReverseVectorizationBackendV1ReverseNormalizationPostApiArg
        >({
            query: (queryArg) => ({
                url: `/backend/v1/reverse_normalization`,
                method: "POST",
                body: queryArg.reverseNormalizationRequest,
            }),
        }),
        updateColForTrainRequestBackendV1UpdateColForTrainPost: build.mutation<
            UpdateColForTrainRequestBackendV1UpdateColForTrainPostApiResponse,
            UpdateColForTrainRequestBackendV1UpdateColForTrainPostApiArg
        >({
            query: (queryArg) => ({
                url: `/backend/v1/update_col_for_train`,
                method: "POST",
                body: queryArg.updateColRequest,
            }),
        }),
        updateColForTrainLstmRequestBackendV1UpdateColForTrainLstmPost: build.mutation<
            UpdateColForTrainLstmRequestBackendV1UpdateColForTrainLstmPostApiResponse,
            UpdateColForTrainLstmRequestBackendV1UpdateColForTrainLstmPostApiArg
        >({
            query: (queryArg) => ({
                url: `/backend/v1/update_col_for_train_lstm`,
                method: "POST",
                body: queryArg.updateColRequest,
            }),
        }),
        funcUserForecastBackendV1UserForecastPost: build.mutation<
            FuncUserForecastBackendV1UserForecastPostApiResponse,
            FuncUserForecastBackendV1UserForecastPostApiArg
        >({
            query: (queryArg) => ({
                url: `/backend/v1/user_forecast`,
                method: "POST",
                body: queryArg.updateColRequest,
            }),
        }),
        funcColsToChoseBackendV1ColsToChosePost: build.mutation<
            FuncColsToChoseBackendV1ColsToChosePostApiResponse,
            FuncColsToChoseBackendV1ColsToChosePostApiArg
        >({
            query: (queryArg) => ({
                url: `/backend/v1/cols_to_chose`,
                method: "POST",
                body: queryArg.colsToChose,
            }),
        }),
        funcConvertTimeToDatetimeBackendV1ConvertTimeToDatetimePost: build.mutation<
            FuncConvertTimeToDatetimeBackendV1ConvertTimeToDatetimePostApiResponse,
            FuncConvertTimeToDatetimeBackendV1ConvertTimeToDatetimePostApiArg
        >({
            query: (queryArg) => ({
                url: `/backend/v1/convert_time_to_datetime`,
                method: "POST",
                body: queryArg.convertRequest,
            }),
        }),
        funcGeneratePossibleDateBackendV1GeneratePossibleDatePost: build.mutation<
            FuncGeneratePossibleDateBackendV1GeneratePossibleDatePostApiResponse,
            FuncGeneratePossibleDateBackendV1GeneratePossibleDatePostApiArg
        >({
            query: (queryArg) => ({
                url: `/backend/v1/generate_possible_date`,
                method: "POST",
                body: queryArg.convertRequest,
            }),
        }),
        funcGenerateForecastBackendV1GenerateForecastPost: build.mutation<
            FuncGenerateForecastBackendV1GenerateForecastPostApiResponse,
            FuncGenerateForecastBackendV1GenerateForecastPostApiArg
        >({
            query: (queryArg) => ({
                url: `/backend/v1/generate_forecast`,
                method: "POST",
                body: queryArg.predictRequest,
            }),
        }),
        readRootGet: build.query<ReadRootGetApiResponse, ReadRootGetApiArg>({
            query: () => ({ url: `/` }),
        }),
    }),
    overrideExisting: false,
})
export { injectedRtkApi as backend }
export type GetConceptsBackendV1AnalyticsdfsPostApiResponse = /** status 200 Successful Response */ any
export type GetConceptsBackendV1AnalyticsdfsPostApiArg = {
    analyticsDFsRequest: AnalyticsDFsRequest
}
export type GetConceptsBackendV1ForecastPostApiResponse = /** status 200 Successful Response */ any
export type GetConceptsBackendV1ForecastPostApiArg = {
    forecastRequest: ForecastRequest
}
export type GetConceptsBackendV1ForecastXgBoostPostApiResponse = /** status 200 Successful Response */ any
export type GetConceptsBackendV1ForecastXgBoostPostApiArg = {
    forecastRequestXgBoost: ForecastRequestXgBoost
}
export type GetMetrixAllBackendV1AllMetrixPostApiResponse = /** status 200 Successful Response */ any
export type GetMetrixAllBackendV1AllMetrixPostApiArg = {
    menrixAllRequest: MenrixAllRequest
}
export type LstmForecastBackendV1LstmForecastPostApiResponse = /** status 200 Successful Response */ any
export type LstmForecastBackendV1LstmForecastPostApiArg = {
    forecastRequestXgBoost: ForecastRequestXgBoost
}
export type RequestForecastNeuralNetworksBackendV1ForecastNeuralNetworksPostApiResponse =
    /** status 200 Successful Response */ any
export type RequestForecastNeuralNetworksBackendV1ForecastNeuralNetworksPostApiArg = {
    forecastRequestNeuralNetworks: ForecastRequestNeuralNetworks
}
export type GetVectorizationBackendV1NormalizationPostApiResponse = /** status 200 Successful Response */ any
export type GetVectorizationBackendV1NormalizationPostApiArg = {
    normalizationRequest: NormalizationRequest
}
export type GetReverseVectorizationBackendV1ReverseNormalizationPostApiResponse =
    /** status 200 Successful Response */ any
export type GetReverseVectorizationBackendV1ReverseNormalizationPostApiArg = {
    reverseNormalizationRequest: ReverseNormalizationRequest
}
export type UpdateColForTrainRequestBackendV1UpdateColForTrainPostApiResponse =
    /** status 200 Successful Response */ any
export type UpdateColForTrainRequestBackendV1UpdateColForTrainPostApiArg = {
    updateColRequest: UpdateColRequest
}
export type UpdateColForTrainLstmRequestBackendV1UpdateColForTrainLstmPostApiResponse =
    /** status 200 Successful Response */ any
export type UpdateColForTrainLstmRequestBackendV1UpdateColForTrainLstmPostApiArg = {
    updateColRequest: UpdateColRequest
}
export type FuncUserForecastBackendV1UserForecastPostApiResponse = /** status 200 Successful Response */ any
export type FuncUserForecastBackendV1UserForecastPostApiArg = {
    updateColRequest: UpdateColRequest
}
export type FuncColsToChoseBackendV1ColsToChosePostApiResponse = /** status 200 Successful Response */ any
export type FuncColsToChoseBackendV1ColsToChosePostApiArg = {
    colsToChose: ColsToChose
}
export type FuncConvertTimeToDatetimeBackendV1ConvertTimeToDatetimePostApiResponse =
    /** status 200 Successful Response */ any
export type FuncConvertTimeToDatetimeBackendV1ConvertTimeToDatetimePostApiArg = {
    convertRequest: ConvertRequest
}
export type FuncGeneratePossibleDateBackendV1GeneratePossibleDatePostApiResponse =
    /** status 200 Successful Response */ any
export type FuncGeneratePossibleDateBackendV1GeneratePossibleDatePostApiArg = {
    convertRequest: ConvertRequest
}
export type FuncGenerateForecastBackendV1GenerateForecastPostApiResponse = /** status 200 Successful Response */ any
export type FuncGenerateForecastBackendV1GenerateForecastPostApiArg = {
    predictRequest: PredictRequest
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
export type AnalyticsDFsRequest = {
    dfs_json_list: object[]
}
export type ForecastRequest = {
    col_target: string
    evaluation_index: number
    last_know_index: number
    epochs: number
    lag: number
    activation: string
    optimizer: string
    dropout_count: number
    model_architecture_params: object[]
    json_list_df_all_data_norm: object[]
}
export type ForecastRequestXgBoost = {
    col_target: string
    evaluation_index: number
    last_know_index: number
    lag: number
    type: string
    model_architecture_params: object[]
    json_list_df_all_data_norm: object[]
    norm_values: string
}
export type MenrixAllRequest = {
    col_time: string
    col_target: string
    json_list_df_reverse_evaluation: object[]
    json_list_df_reverse_comparative: object[]
}
export type ForecastRequestNeuralNetworks = {
    col_target: string
    evaluation_index: number
    last_know_index: number
    model_architecture_params: object[]
    json_list_df_all_data_norm: object[]
    norm_values: string
    type: string
}
export type NormalizationRequest = {
    col_time: string
    col_target: string
    json_list_df: object[]
}
export type ReverseNormalizationRequest = {
    col_time: string
    col_target: string
    json_list_norm_df: object[]
    min_val: number
    max_val: number
}
export type UpdateColRequest = {
    col_for_train: string[]
}
export type ColsToChose = {
    df: object[]
}
export type ConvertRequest = {
    df: object[]
    time_column: string
}
export type PredictRequest = {
    df: object[]
    time_column: string
    col_target: string
    forecast_horizon_time: string
}
export const {
    useGetConceptsBackendV1AnalyticsdfsPostMutation,
    useGetConceptsBackendV1ForecastPostMutation,
    useGetConceptsBackendV1ForecastXgBoostPostMutation,
    useGetMetrixAllBackendV1AllMetrixPostMutation,
    useLstmForecastBackendV1LstmForecastPostMutation,
    useRequestForecastNeuralNetworksBackendV1ForecastNeuralNetworksPostMutation,
    useGetVectorizationBackendV1NormalizationPostMutation,
    useGetReverseVectorizationBackendV1ReverseNormalizationPostMutation,
    useUpdateColForTrainRequestBackendV1UpdateColForTrainPostMutation,
    useUpdateColForTrainLstmRequestBackendV1UpdateColForTrainLstmPostMutation,
    useFuncUserForecastBackendV1UserForecastPostMutation,
    useFuncColsToChoseBackendV1ColsToChosePostMutation,
    useFuncConvertTimeToDatetimeBackendV1ConvertTimeToDatetimePostMutation,
    useFuncGeneratePossibleDateBackendV1GeneratePossibleDatePostMutation,
    useFuncGenerateForecastBackendV1GenerateForecastPostMutation,
    useReadRootGetQuery,
} = injectedRtkApi
