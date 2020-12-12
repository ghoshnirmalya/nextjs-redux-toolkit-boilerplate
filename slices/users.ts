import {
  Action,
  AnyAction,
  createAction,
  createDraftSafeSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { AppState } from "store";
import { fetchUsers } from "thunks/users";
import { User } from "types/user";

interface IRejectedAction extends Action {
  payload: {
    error: Error;
  };
}

interface IInitialState {
  users: User[];
  loading: string;
  error: any;
}

const hydrate = createAction(HYDRATE);

function isRejectedAction(action: AnyAction): action is IRejectedAction {
  return action.type.endsWith("rejected");
}

const initialState: IInitialState = {
  users: [],
  loading: "idle",
  error: null,
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(hydrate, (state, action) => {
        return {
          ...state,
          ...(action.payload as any)[usersSlice.name],
        };
      })
      .addCase(fetchUsers.pending, (state) => {
        state.users = [];
        state.loading = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = "loaded";
      })
      .addMatcher(isRejectedAction, (state, action) => {
        state.loading = "error";
        state.error = action.payload.error;
      });
  },
});

export const selectUsers = () =>
  createDraftSafeSelector(
    (state: AppState) => state,
    (state: AppState) => state?.[usersSlice.name]
  );
