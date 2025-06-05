import { configureStore, combineReducers } from "@reduxjs/toolkit";
import rootSlice from "./rootSlice.ts";

const reducer = combineReducers({
  root: rootSlice,
});

export const store = configureStore({
  reducer,
});

// Infer types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
