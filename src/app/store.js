import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../reducers/userSlice";
import articleReducer from "../reducers/articleSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    article: articleReducer,
  },
});
