import { api } from "@/services/api";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";


interface BlogState {
    blogs:BlogPost[];
    singleBlog:BlogPost | null
    loading:boolean;
    comments:Comment[];
    error:string | null
}


const initialState: BlogState ={
    blogs:[],
    singleBlog: null,
    comments:[],
    loading:false,
    error:null
}

export const blogSlice = createSlice({
    name:"blogs",
    initialState,
    reducers:{
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
          },
          setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
          },
          resetBlogs: (state) => {
            state.blogs = [];
            state.singleBlog = null;
            state.loading = false;
            state.error = null;
          },
    },
    extraReducers: (builder) => {
        builder.addMatcher(api.endpoints.getBlogs.matchPending , (state) => {
            state.loading = true;
            state.error = null
        })
        .addMatcher(api.endpoints.getBlogs.matchFulfilled, (state, action) => {
            state.blogs = action.payload.data;
            state.loading = false;
            state.error = null;
          })
          .addMatcher(api.endpoints.getBlogs.matchRejected, (state, action) => {
            state.loading = false;
            state.error = action.error?.message ?? "Failed to fetch blogs";
          })

          //For single Blog
          .addMatcher(api.endpoints.getSingleBlog.matchPending, (state) => {
            state.loading = true;
            state.error = null;
            state.singleBlog = null;
          })
          .addMatcher(api.endpoints.getSingleBlog.matchFulfilled, (state, action) => {
            state.singleBlog = action.payload.data[0]; // Assuming API returns an array
            state.loading = false;
            state.error = null;
          })
          .addMatcher(api.endpoints.getSingleBlog.matchRejected, (state, action) => {
            state.loading = false;
            state.error = action.error?.message ?? "Failed to fetch the blog";
            state.singleBlog = null;
          })

            //Post Comments
            .addMatcher(api.endpoints.postBlog.matchFulfilled, (state, action) => {
                state.blogs.push(action.payload.data);
                state.loading = false;
                state.error = null;
            })
            .addMatcher(api.endpoints.postBlog.matchRejected, (state, action) => {
                state.loading = false;
                state.error = action.error?.message ?? "Failed to post the blog";
            })

            //Create Comments
            .addMatcher(api.endpoints.createComment.matchFulfilled, (state,action) => {
                state.comments.push(action.payload.data);
                state.loading = false;
                state.error = null;
            })
        //Get Comments
            .addMatcher(api.endpoints.getComment.matchFulfilled, (state, action) => {
                state.comments = action.payload.data;
                state.loading = false;
                state.error = null;
            })

    }
})

export default blogSlice.reducer