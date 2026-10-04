import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const checkLogin = createAsyncThunk(
  "checklogin",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/checklogin", {
        credentials: "include",
      });
      const result = await res.json();
      if (!result.success) {
        return rejectWithValue(result.message);
      }

      return result.user;
    } catch (error) {
      console.log("ERROR", error);
      return rejectWithValue("something went wrong");
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState: { user: null, userLoading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkLogin.pending, (state) => {
        state.userLoading = true;
        state.user = null;
        state.error = null;
      })
      .addCase(checkLogin.fulfilled, (state, action) => {
        state.userLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(checkLogin.rejected, (state, action) => {
        state.userLoading = false;
        state.user = null;
        state.error = action.payload;
      });
  },
});

export default userSlice;
