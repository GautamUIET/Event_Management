import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // { name, role }
  userId: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
  setAuthUser: (state, action) => {
            state.user = action.payload;
            state.userId = action.payload._id;
            state.isAuthenticated = true;
            state.logoutError = null; // Clear any previous errors
        },
    logout: (state) => {
      state.user = null;
      state.userId = null;
      state.token = null;
    },
  },
});

export const { setAuthUser, logout } = authSlice.actions;
export default authSlice.reducer;
