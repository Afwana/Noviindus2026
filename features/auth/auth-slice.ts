import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  sendOtpRequest,
  SendOtpResponse,
  createProfileRequest,
  CreateProfileResponse,
  verifyOtpRequest,
  VerifyOtpResponse,
  type CreateProfileRequest,
  type SendOtpRequest,
  type VerifyOtpRequest,
} from "./auth-api";
import { applyAuthResponse } from "@/utils/auth-storage";
import { getApiErrorMessage } from "@/utils/api-error";

type AuthState = {
  loading: boolean;
  error: string | null;
  sendOtp: SendOtpResponse | null;
  verifyOtp: VerifyOtpResponse | null;
  createProfile: CreateProfileResponse | null;
};

const initialState: AuthState = {
  loading: false,
  error: null,
  sendOtp: null,
  verifyOtp: null,
  createProfile: null,
};

function getErrorMessage(error: unknown): string {
  return getApiErrorMessage(error, "Request failed");
}

export const verifyOtpThunk = createAsyncThunk<
  VerifyOtpResponse,
  VerifyOtpRequest,
  { rejectValue: string }
>("auth/verifyOtp", async (payload, { rejectWithValue }) => {
  try {
    const data = await verifyOtpRequest(payload);
    if (data.success && data.login) {
      applyAuthResponse(data);
    }
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const sendOtpThunk = createAsyncThunk<
  SendOtpResponse,
  SendOtpRequest,
  { rejectValue: string }
>("auth/sendOtp", async (payload, { rejectWithValue }) => {
  try {
    return await sendOtpRequest(payload);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const createProfileThunk = createAsyncThunk<
  CreateProfileResponse,
  CreateProfileRequest,
  { rejectValue: string }
>("auth/createProfile", async (payload, { rejectWithValue }) => {
  try {
    const data = await createProfileRequest(payload);
    if (data.success) {
      applyAuthResponse(data);
    }
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtpThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.sendOtp = action.payload;
      })
      .addCase(sendOtpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "OTP send failed";
      })
      .addCase(verifyOtpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtpThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.verifyOtp = action.payload;
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "OTP verification failed";
      })
      .addCase(createProfileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProfileThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.createProfile = action.payload;
      })
      .addCase(createProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Profile creation failed";
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
