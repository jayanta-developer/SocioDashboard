import Axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const localURL = "http://localhost:4000/socio/api";
export const serverURL = "https://socioserver.onrender.com/socio/api";

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});

const PropertySlice = createSlice({
  name: "property",
  initialState: {
    data: [],
    status: STATUSES.LOADING,
  },

  reducers: {
    setUser: (state, action) => {
      state.data = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(FetchProperties.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(FetchProperties.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(FetchProperties.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { get } = PropertySlice.actions;
export default PropertySlice.reducer;

export const FetchProperties = createAsyncThunk("get/properties", async () => {
  const res = await fetch(localURL + "/flats");
  const data = await res.json();
  return data;
});

export const CreateProperty = createAsyncThunk(
  "create/property",
  async (data) => {
    try {
      const res = await Axios.post(localURL + "/flats/create", {
        ...data,
      });
    } catch (err) {
      console.log(err);
    }
  }
);

export const DeletePropert = createAsyncThunk(
  "delete/properties",
  async (id) => {
    try {
      const res = await Axios.post(localURL + "/flats/delete/" + id);
    } catch (err) {
      console.log(err);
    }
  }
);
