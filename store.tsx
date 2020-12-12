import { configureStore, ThunkAction } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { Action } from "redux";
import { usersSlice } from "slices/users";

const store = () =>
  configureStore({
    reducer: {
      [usersSlice.name]: usersSlice.reducer,
    },
    devTools: true,
  });

export type AppStore = ReturnType<typeof store>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

export const wrapper = createWrapper<AppStore>(store);
