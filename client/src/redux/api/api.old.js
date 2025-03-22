import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (chatId) => `chat/messages/${chatId}`,
      providesTags: ["messages"],
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, extra }
      ) {
        const socket = extra.socket;
        try {
          await cacheDataLoaded;
          const messageListener = (message) => {
            updateCachedData((draft) => {
              draft.push(message);
            });
          };
          socket.on("message", messageListener);

          await cacheEntryRemoved;
          socket.off("receiveMessage", messageListener);
        } catch (error) {
          console.log(error);
        }
      },
    }),
    sendMessage: builder.mutation({
      query: (message) => ({
        url: "chat/send-message",
        method: "POST",
        body: message,
      }),
      invalidatesTags: ["messages"],
      async onQueryStarted(message, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          console.log(data);

          if (data.success) {
            console.log("heelo");
            dispatch(
              api.util.updateQueryData(
                "getMessages",
                message.chatId,
                (draft) => {
                  draft.push(data.message);
                }
              )
            );
          }
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const { useGetMessagesQuery, useSendMessageMutation } = api;

export default api;
