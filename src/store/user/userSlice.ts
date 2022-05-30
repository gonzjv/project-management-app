import { createSlice, createAsyncThunk, AnyAction } from "@reduxjs/toolkit";
import userService from './userService';

interface IError {
  message?: string;
  response: {
    data: {
      message?: string;
    };
  };
}

const initialState = {
  userDetails: {
    name: '',
    login: '',
    password: ''
  },
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  deleteStatusCode: null,
};

//Get user by ID
export const getUserById = createAsyncThunk(
  'user/getUserById',
  async (id: string, thunkAPI) => {
    try {
      return await userService.getUserById(id);
    } catch (error) {
      const message =
        ((error as IError).response &&
          (error as IError).response.data &&
          (error as IError).response.data.message) ||
        (error as IError).message ||
        (error as IError) ||
        (error as IError).toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update user profile by id
export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (updateUserData: { id: string, name: string, login: string, password: string }, thunkAPI) => {
    try {
      return await userService.updateUserProfile(updateUserData);
    } catch (error) {
      const message =
        ((error as IError).response &&
          (error as IError).response.data &&
          (error as IError).response.data.message) ||
        (error as IError).message ||
        (error as IError) ||
        (error as IError).toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete by id
export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (id: string, thunkAPI) => {
    try {
      return await userService.deleteUser(id);
    } catch (error) {
      const message =
        ((error as IError).response &&
          (error as IError).response.data &&
          (error as IError).response.data.message) ||
        (error as IError).message ||
        (error as IError) ||
        (error as IError).toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUser: (state) => {
      state.userDetails = {
        name: '',
        login: '',
        password: ''
      };
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.deleteStatusCode = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserById.fulfilled, (state, action: AnyAction) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userDetails = action.payload;
      })
      .addCase(getUserById.rejected, (state, action: AnyAction) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: AnyAction) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userDetails = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action: AnyAction) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action: AnyAction) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.deleteStatusCode = action.payload;
      })
      .addCase(deleteUser.rejected, (state, action: AnyAction) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
  },
});

export const { resetUser } = userSlice.actions;
export default userSlice.reducer;