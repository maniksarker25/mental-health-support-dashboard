import { baseApi } from "./baseApi";
import type {
  ApiResponse,
  TopicListParams,
  TopicListResponse,
  TopicListResult,
  TopicPayload,
  TopicRecord,
} from "../../types";

export const topicApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTopics: builder.query<TopicListResult, TopicListParams>({
      query: (params) => ({
        url: "topic",
        params,
      }),
      transformResponse: (response: TopicListResponse) => ({
        data: response.data,
        meta: response.meta,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: "Topic" as const, id: _id })),
              { type: "Topic" as const, id: "LIST" },
            ]
          : [{ type: "Topic" as const, id: "LIST" }],
    }),
    createTopic: builder.mutation<TopicRecord, TopicPayload>({
      query: (body) => ({
        url: "topic",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<TopicRecord>) => response.data,
      invalidatesTags: [{ type: "Topic", id: "LIST" }],
    }),
    updateTopic: builder.mutation<
      TopicRecord,
      { id: string; body: Partial<TopicPayload> }
    >({
      query: ({ id, body }) => ({
        url: `topic/${encodeURIComponent(id)}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiResponse<TopicRecord>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Topic", id },
        { type: "Topic", id: "LIST" },
      ],
    }),
    deleteTopic: builder.mutation<TopicRecord, string>({
      query: (id) => ({
        url: `topic/${encodeURIComponent(id)}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiResponse<TopicRecord>) => response.data,
      invalidatesTags: (_result, _error, id) => [
        { type: "Topic", id },
        { type: "Topic", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetTopicsQuery,
  useCreateTopicMutation,
  useUpdateTopicMutation,
  useDeleteTopicMutation,
} = topicApi;
