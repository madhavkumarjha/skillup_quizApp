import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../../../utils/baseQueryWithAuth";

export const courseApi = createApi({
  reducerPath: "courseApi",
  baseQuery: baseQueryWithAuth,

  tagTypes: ["Course"],
  endpoints: (builder) => ({
    getAllCourses: builder.query({
      query: () => "/course/all",
      providesTags: ["Course"],
    }),

    getInstructorCourses: builder.query({
      query: (id) => `/instructor/${id}/courses`,
      providesTags: ["Course"],
    }),

    getCourseById: builder.query({
      query: (id) => `/course/get/${id}`,
    }),

    createCourse: builder.mutation({
      query: (body) => ({
        url: "/course/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Course"],
    }),

    updateCourse: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/course/${id}`,
        method: "PATCH",
        body: rest,
      }),
      invalidatesTags: ["Course"],
    }),

    deleteCourse: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/course/${id}`,
        method: "DELETE",
        body: rest,
      }),
      invalidatesTags: ["Course"],
    }),

    publishCourse: builder.mutation({
      query: ({ id, isPublished }) => ({
        url: `/course/publish/${id}`,
        method: "PATCH",
        body: { isPublished },
      }),
      invalidatesTags: ["Course"],
    }),
  }),
});

export const {
  useGetAllCoursesQuery,
  useGetCourseByIdQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  usePublishCourseMutation,
  useGetInstructorCoursesQuery,
} = courseApi;
