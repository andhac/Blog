import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";
import { register } from "module";

const baseUrl = "http://localhost:1337/api";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState, endpoint }) => {
      headers.set("Content-Type", "application/json");
    
      // Only attach Authorization header for protected routes (not "getBlogs")
      const token = (getState() as RootState).auth.accessToken;
      if (token && endpoint !== "getBlogs" && endpoint !== "getSingleBlog" ) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    
      return headers;
    }
    
  }),
  endpoints: (builder) => ({
    me: builder.query<ApiResponse<User>, void>({
        query: () => "/users/me",
    }),
    login: builder.mutation<ApiResponse<{jwt:string}>,{ identifier: string; password: string }>({
  
      query: (body) => {
        return { url: `/auth/local`, method: "POST", body };
      },
    }),
    register: builder.mutation<ApiResponse<{jwt:string,User:User}>, User>({
        query:(body) => {
            return {url: `/auth/local/register`, method: "POST", body};
        }
    }),
    getBlogs:builder.query<ApiResponse<BlogPost>,void>({
      query: () => `/blogs?filters[blogStatus][$eq]=approved`
    }),
    getSingleBlog:builder.query<ApiResponse<BlogPost>, string>({
      query: (slug) => `/blogs?filters[slug][$eq]=${slug}`
    }),
    postBlog:builder.mutation<ApiResponse<void>,BlogPost>({
      query:(body) => {
        return {url: '/blogs', method: 'POST', body}
      }
    }),
    createComment:builder.mutation<ApiResponse<void>, Comment> ({
      query:(body) => {
        return {url: '/comments', method: 'POST', body}
      }
    })
  }),
});

export const { useMeQuery,useLoginMutation, useRegisterMutation, useGetBlogsQuery, useGetSingleBlogQuery, usePostBlogMutation, useCreateCommentMutation } = api;
