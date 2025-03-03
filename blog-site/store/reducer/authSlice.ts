import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { api } from "@/services/api";

// Define a type for the slice state
interface AuthState {
  accessToken: string;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  accessToken:
    typeof window !== "undefined"
      ? localStorage.getItem("access_token") ?? ""
      : "",
  isAuthenticated:
    typeof window !== "undefined"
      ? Boolean(localStorage.getItem("access_token"))
      : false,
  loading: true,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ loading: boolean }>) => {
      state.loading = action.payload.loading;
    },
    setTokens: (state, action: PayloadAction<{ accessToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },
    resetToken: (state) => {
      state.accessToken = "";
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(api.endpoints.login.matchFulfilled, (state, action) => {
        const data = action.payload;
        localStorage.setItem("access_token", data.jwt);
        state.accessToken = data.jwt;
        state.isAuthenticated = true;
        
      })
      .addMatcher(api.endpoints.login.matchRejected, (state) => {
        state.loading = false;
        return state;
      });
  },
});

export const {setTokens, resetToken} = authSlice.actions;
export default authSlice.reducer;