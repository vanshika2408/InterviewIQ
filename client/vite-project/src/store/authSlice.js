import { createSlice } from "@reduxjs/toolkit";

const savedUser = localStorage.getItem("interviewiq_user");
const savedToken = localStorage.getItem("token");

const initialState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken || null,
  isAuthenticated: Boolean(savedToken && savedUser),
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    login: (state, action) => {
      const { user, accessToken } = action.payload;

      state.user = user;
      state.token = accessToken;
      state.isAuthenticated = true;

      localStorage.setItem(
        "interviewiq_user",
        JSON.stringify(user)
      );

      localStorage.setItem("token", accessToken);
    },

    register: (state, action) => {
      const { user, accessToken } = action.payload;

      state.user = user;
      state.token = accessToken;
      state.isAuthenticated = true;

      localStorage.setItem(
        "interviewiq_user",
        JSON.stringify(user)
      );

      localStorage.setItem("token", accessToken);
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("interviewiq_user");
      localStorage.removeItem("token");
    },

    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;

      state.user = user;
      state.token = accessToken;
      state.isAuthenticated = true;

      localStorage.setItem(
        "interviewiq_user",
        JSON.stringify(user)
      );

      localStorage.setItem("token", accessToken);
    },
  },
});

export const {
  login,
  register,
  logout,
  setCredentials,
} = authSlice.actions;

export default authSlice.reducer;