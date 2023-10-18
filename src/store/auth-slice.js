import { createSlice } from "@reduxjs/toolkit";

// Try to load the login state from local storage
const storedLoginState = JSON.parse(localStorage.getItem("loginState"));

const initialState = storedLoginState || { isLoggedIn: false, team_id: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.team_id = action.payload.team_id;
      localStorage.setItem("loginState", JSON.stringify(state));
    },
    logout(state) {
      state.isLoggedIn = false;
      state.team_id = null;
      localStorage.removeItem("loginState");
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice;
