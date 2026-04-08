import { api } from "@/utils/api";

export interface SendOtpRequest {
  mobile: string;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
}

export interface VerifyOtpRequest {
  mobile: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  login: boolean;
  message: string;
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
}

export interface CreateProfileRequest {
  mobile: string;
  name: string;
  email: string;
  qualification: string;
  profile_image: File;
}

export interface CreateProfileResponse {
  success: boolean;
  access_token?: string;
  refresh_token?: string;
  message: string;
  user?: Record<string, unknown>;
}

export async function sendOtpRequest(
  payload: SendOtpRequest,
): Promise<SendOtpResponse> {
  const formData = new FormData();
  formData.append("mobile", payload.mobile);
  const response = await api.post<SendOtpResponse>("/auth/send-otp", formData);
  return response.data;
}

export async function verifyOtpRequest(
  payload: VerifyOtpRequest,
): Promise<VerifyOtpResponse> {
  const formData = new FormData();
  formData.append("mobile", payload.mobile);
  formData.append("otp", payload.otp);
  const response = await api.post<VerifyOtpResponse>("/auth/verify-otp", formData);
  return response.data;
}

export async function createProfileRequest(
  payload: CreateProfileRequest,
): Promise<CreateProfileResponse> {
  const formData = new FormData();
  formData.append("mobile", payload.mobile);
  formData.append("name", payload.name);
  formData.append("email", payload.email);
  formData.append("qualification", payload.qualification);
  formData.append("profile_image", payload.profile_image);
  const response = await api.post<CreateProfileResponse>(
    "/auth/create-profile",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
}
