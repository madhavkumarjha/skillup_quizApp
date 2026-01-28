import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const publicApi = createApi({
  reducerPath: "publicApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  tagTypes: ["Course", "Instructor"],
  endpoints: (builder) => ({
    getAllCoursesPublic: builder.query({
      query: () => "/course/all",
      providesTags: ["Course"],   // ✅ mark this query
    }),
    getAllInstructorsPublic: builder.query({
      query: () => "/instructor/all",
      providesTags: ["Instructor"], // ✅ mark this query
    }),
  }),
});


export const {
useGetAllCoursesPublicQuery,
useGetAllInstructorsPublicQuery
}=publicApi;
