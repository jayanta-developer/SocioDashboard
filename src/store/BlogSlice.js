import Axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const baseURL = "http://localhost:4000/socio/api";
// export const baseURL = "https://socioserver-jg6j.onrender.com/socio/api";

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});

const BlogSlice = createSlice({
  name: "blog",
  initialState: {
    data: [],
    status: STATUSES.IDLE, // Changed from STATUSES.LOADING
  },
  reducers: {
    get: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(FetchBlogs.pending, (state) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(FetchBlogs.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(FetchBlogs.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
        console.error("FetchBlogs rejected:", action.payload);
      });
  },
});

export const { get } = BlogSlice.actions;
export default BlogSlice.reducer;

export const FetchBlogs = createAsyncThunk("get/blogs", async () => {
  const res = await fetch(baseURL + "/blogs");
  const data = await res.json();
  return data;
});

export const DeleteBlog = createAsyncThunk("delete/blog", async (id) => {
  try {
    await Axios.post(baseURL + "/blog/delete/" + id);
  } catch (err) {
    console.log(err);
  }
});

export const CreateBlog = createAsyncThunk("create/blog", async (data) => {
  try {
    await Axios.post(baseURL + "/blog/create", {
      ...data,
    });
  } catch (err) {
    console.log(err);
  }
});

// export const UpdateProperty = createAsyncThunk(
//   "update/properties",
//   async ({ data, id, otherVal, rating }) => {
//     try {
//       await Axios.post(baseURL + "/flats/update/" + id, {
//         ...data,
//         ...(isEmpty(otherVal) ? {} : otherVal),
//         ...rating,
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   }
// );
