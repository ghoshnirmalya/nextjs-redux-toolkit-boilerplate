import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./slices/users";
import rootReducer from "./root-reducer";

const store = configureStore({
  reducer: {
    ...rootReducer,
    users: usersReducer,
  },
  devTools: process.env.NODE_ENV !== "development" ? false : true,
});

export type AppDispatch = typeof store.dispatch;

export default store;
