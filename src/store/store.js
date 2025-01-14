import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import PropertySlice from "./PropertySlice";
import BlogSlice from "./BlogSlice";

const persistConfig = {
  key: "root",
  storage,
};

const reducer = combineReducers({
  Properties: PropertySlice,
  Blogs: BlogSlice,
});

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persistedReducer,
});

export default store;
