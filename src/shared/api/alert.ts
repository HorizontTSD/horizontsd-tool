import { alert as api } from "./alert_injection";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    createAlertEndpointAlertManagerV1CreatePost: build.mutation<
      CreateAlertEndpointAlertManagerV1CreatePostApiResponse,
      CreateAlertEndpointAlertManagerV1CreatePostApiArg
    >({
      query: (queryArg) => ({
        url: `/alert_manager/v1/create`,
        method: "POST",
        body: queryArg.alertConfigRequest,
      }),
    }),
    deleteAlertEndpointAlertManagerV1DeleteDelete: build.mutation<
      DeleteAlertEndpointAlertManagerV1DeleteDeleteApiResponse,
      DeleteAlertEndpointAlertManagerV1DeleteDeleteApiArg
    >({
      query: (queryArg) => ({
        url: `/alert_manager/v1/delete`,
        method: "DELETE",
        body: queryArg.deleteAlertRequest,
      }),
    }),
    listAlertConfigsAlertManagerV1ListGet: build.query<
      ListAlertConfigsAlertManagerV1ListGetApiResponse,
      ListAlertConfigsAlertManagerV1ListGetApiArg
    >({
      query: () => ({ url: `/alert_manager/v1/list` }),
    }),
    notificationRequestAlertManagerV1NotificationGet: build.query<
      NotificationRequestAlertManagerV1NotificationGetApiResponse,
      NotificationRequestAlertManagerV1NotificationGetApiArg
    >({
      query: () => ({ url: `/alert_manager/v1/notification` }),
    }),
    funcFetchDataForFrontAlertManagerV1FetchDataForFrontGet: build.query<
      FuncFetchDataForFrontAlertManagerV1FetchDataForFrontGetApiResponse,
      FuncFetchDataForFrontAlertManagerV1FetchDataForFrontGetApiArg
    >({
      query: () => ({ url: `/alert_manager/v1/fetch_data_for_front` }),
    }),
    readRootGet: build.query<ReadRootGetApiResponse, ReadRootGetApiArg>({
      query: () => ({ url: `/` }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as alert };
export type CreateAlertEndpointAlertManagerV1CreatePostApiResponse =
  /** status 200 Successful Response */ any;
export type CreateAlertEndpointAlertManagerV1CreatePostApiArg = {
  alertConfigRequest: AlertConfigRequest;
};
export type DeleteAlertEndpointAlertManagerV1DeleteDeleteApiResponse =
  /** status 200 Successful Response */ any;
export type DeleteAlertEndpointAlertManagerV1DeleteDeleteApiArg = {
  deleteAlertRequest: DeleteAlertRequest;
};
export type ListAlertConfigsAlertManagerV1ListGetApiResponse =
  /** status 200 Successful Response */ any;
export type ListAlertConfigsAlertManagerV1ListGetApiArg = void;
export type NotificationRequestAlertManagerV1NotificationGetApiResponse =
  /** status 200 Successful Response */ any;
export type NotificationRequestAlertManagerV1NotificationGetApiArg = void;
export type FuncFetchDataForFrontAlertManagerV1FetchDataForFrontGetApiResponse =
  /** status 200 Successful Response */ any;
export type FuncFetchDataForFrontAlertManagerV1FetchDataForFrontGetApiArg =
  void;
export type ReadRootGetApiResponse = /** status 200 Successful Response */ any;
export type ReadRootGetApiArg = void;
export type ValidationError = {
  loc: (string | number)[];
  msg: string;
  type: string;
};
export type HttpValidationError = {
  detail?: ValidationError[];
};
export type AlertConfigRequest = {
  name: string;
  threshold_value: number;
  alert_scheme: string;
  trigger_frequency: string;
  message: string;
  telegram_nicknames: string[];
  email_addresses: string[];
  include_graph: boolean;
  date_start: string;
  date_end: string;
  time_start: string;
  time_end: string;
  start_warning_interval: string;
  sensor_id: string;
  model: string;
};
export type DeleteAlertRequest = {
  filename: string;
};
export const {
  useCreateAlertEndpointAlertManagerV1CreatePostMutation,
  useDeleteAlertEndpointAlertManagerV1DeleteDeleteMutation,
  useListAlertConfigsAlertManagerV1ListGetQuery,
  useNotificationRequestAlertManagerV1NotificationGetQuery,
  useFuncFetchDataForFrontAlertManagerV1FetchDataForFrontGetQuery,
  useReadRootGetQuery,
} = injectedRtkApi;
