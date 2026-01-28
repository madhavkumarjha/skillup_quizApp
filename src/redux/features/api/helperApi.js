import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../../utils/baseQueryWithAuth";


export const helperApi = createApi({
  reducerPath: "helperApi",
  baseQuery: baseQueryWithAuth,

  tagTypes: ["Helper"],
  endpoints: (builder) => ({
    getUserRole: builder.query({
      query: () => `/auth/me`,
      providesTags: ["Helper"],
    }),
    getUserProfile: builder.query({
      query: (id) => `/auth/profile/${id}`,
      providesTags: ["Helper"],
    }),

    updateProfilePic: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/auth/profile/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Helper"],
    }),

    updateUserProfile: builder.mutation({
      query: ({ id, data }) => ({
        url: `/auth/update/profile/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Helper"],
    }),

    updateUserPassword: builder.mutation({
      query: ({ id, data }) => ({
        url: `/auth/change-password/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Helper"],
    }),

    uploadCourseMedia: builder.mutation({
      query: (formData) => ({
        url: "/upload/course",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Helper"],
    }),
  }),
});

export const { useUpdateProfilePicMutation, useGetUserProfileQuery,useUpdateUserPasswordMutation,useUpdateUserProfileMutation,useUploadCourseMediaMutation ,useGetUserRoleQuery } =
  helperApi;
