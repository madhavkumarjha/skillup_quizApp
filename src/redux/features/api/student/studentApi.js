import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../../../utils/baseQueryWithAuth";

export const studentApi = createApi({
  reducerPath: "studentApi",
  baseQuery:baseQueryWithAuth,

  tagTypes: ["Student"],
  endpoints: (builder) => ({
    getAllStudents: builder.query({
      query: () => "/student/all",
      providesTags: ["Student"],
    }),

    getStudentById: builder.query({
      query: (id) => `/student/${id}`,
    }),

    createStudent: builder.mutation({
      query: (body) => ({
        url: "/student/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Student"],
    }),

    updateStudent: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/student/${id}`,
        method: "PATCH",
        body: rest,
      }),
      invalidatesTags: ["Student"],
    }),

    deleteStudent: builder.mutation({
      query: (id) => ({
        url: `/admin/students/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Student"],
    }),

    enrolledCourse: builder.mutation({
      query: ({ studentId, courseId }) => ({
        url: `/student/enroll/${studentId}/${courseId}`,
        method: "PATCH",
        // body: { studentId, courseId },
      }),
      invalidatesTags: ["Student"],
    }),

    studentCourses: builder.query({
      query: ({ studentId }) => ({
        url: `/student/courses/${studentId}`,
        method: "GET",
        // body: { studentId },
      }),
      invalidatesTags: ["Student"],
    }),

    studentQuizLeaderboard: builder.query({
      query: ({ studentId }) => ({
        url: `/student/leaderboard/${studentId}`,
        method: "GET",
        // body: { studentId },
      }),
      invalidatesTags: ["Student"],
    }),
  }),
});

export const {
  useGetAllStudentsQuery,
  useGetStudentByIdQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useEnrolledCourseMutation,
  useStudentCoursesQuery,
} = studentApi;
