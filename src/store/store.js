import { configureStore, createAsyncThunk } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";

const checkLoginUser = createAsyncThunk("user", async (_, {}) => {});

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userSlice.reducer,
    },
  });
};
