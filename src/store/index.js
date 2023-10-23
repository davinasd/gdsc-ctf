import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth-slice";
import questionSlice from "./question-slice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    question: questionSlice.reducer,
  },
});

export default store;
