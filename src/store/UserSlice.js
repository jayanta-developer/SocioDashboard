import Axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// export const baseURL = "http://localhost:4000/socio/api";
export const baseURL = "https://socioserver-jg6j.onrender.com/socio/api";

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});

const UserSlice = createSlice({
  name: "user",
  initialState: {
    data: [],
    status: STATUSES.IDLE,
  },
  reducers: {
    get: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(FetchUser.pending, (state) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(FetchUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(FetchUser.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
        console.error("FetchBlogs rejected:", action.payload);
      });
  },
});

export const { get } = UserSlice.actions;
export default UserSlice.reducer;

export const FetchUser = createAsyncThunk("get/user", async () => {
  const res = await fetch(baseURL + "/users");
  const data = await res.json();
  return data;
});

export const DeleteUser = createAsyncThunk("get/delete", async (id) => {
  try {
    await Axios.post(baseURL + "/user/delete/" + id);
  } catch (err) {
    console.log(err);
  }
});
