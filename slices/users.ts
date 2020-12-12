import {
  Action,
  AnyAction,
  createAction,
  createAsyncThunk,
  createDraftSafeSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { AppState } from "store";
import { User } from "types/user";

interface RejectedAction extends Action {
  payload: {
    error: Error;
  };
}

interface IUsersState {
  users: User[];
  loading: string;
  error: any;
}

const hydrate = createAction(HYDRATE);

function isRejectedAction(action: AnyAction): action is RejectedAction {
  return action.type.endsWith("rejected");
}

export const getUsers = createAsyncThunk(
  "users/getUsers",
  async (_, thunkAPI) => {
    try {
      const response = await fetch("https://reqres.in/api/users?page=2");
      const { data } = await response.json();

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

const initialState: IUsersState = {
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
      .addCase(getUsers.pending, (state) => {
        state.users = [];
        state.loading = "loading";
      })
      .addCase(getUsers.fulfilled, (state, action) => {
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
