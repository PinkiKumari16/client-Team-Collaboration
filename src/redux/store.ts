import { configureStore, combineReducers } from "@reduxjs/toolkit";
import rootSlice from "./rootSlice";

const reducer = combineReducers({
  root: rootSlice,
});

export const store = configureStore({
  reducer,
});

// Types inferred from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
