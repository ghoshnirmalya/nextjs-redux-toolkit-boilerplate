import {
  Action,
  AnyAction,
  createAsyncThunk,
  createDraftSafeSelector,
  createSlice,
} from "@reduxjs/toolkit";
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

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state, action) => {
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

export const selectUsers = createDraftSafeSelector(
  (state: any) => state,
  (state: { users: IUsersState }) => ({
    users: state.users.users,
    loading: state.users.loading,
    error: state.users.error,
  })
);

export default usersSlice.reducer;
