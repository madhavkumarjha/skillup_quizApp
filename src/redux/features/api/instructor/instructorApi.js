import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../../../utils/baseQueryWithAuth";


export const instructorApi = createApi({
  reducerPath: "instructorApi",
  baseQuery: baseQueryWithAuth,

  tagTypes: ["Instructor"],
  endpoints: (builder) => ({
    getAllInstructors: builder.query({
      query: () => "/instructor/all",
      providesTags: ["Instructor"],
    }),

    getInstructorById: builder.query({
      query: (id) => `/instructor/${id}`,
    }),

    createInstructor: builder.mutation({
      query: (body) => ({
        url: "/instructor/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Instructor"],
    }),

    updateInstructor: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/instructor/${id}`,
        method: "PATCH",
        body: rest,
      }),
      invalidatesTags: ["Instructor"],
    }),

    getInstructorStudents: builder.query({
      query: (id) => `/instructor/${id}/students`,
    }),


    // deleteInstructor: builder.mutation({
    //   query: ({ id, ...rest }) => ({
    //     url: `/admin/instructors/${id}`,
    //     method: "DELETE",
    //     body: rest,
    //   }),
    //   invalidatesTags: ["Instructor"],
    // }),
    deleteInstructor: builder.mutation({
      query: (id) => ({
        url: `/admin/instructors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Instructor"],
    }),
  }),
});

export const {
  useGetAllInstructorsQuery,
  useGetInstructorByIdQuery,
  useCreateInstructorMutation,
  useUpdateInstructorMutation,
  useDeleteInstructorMutation,
  useGetInstructorStudentsQuery,
} = instructorApi;
