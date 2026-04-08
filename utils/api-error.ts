import axios from "axios";

type ApiMessagePayload = {
  success?: boolean;
  message?: string;
};

export function getApiErrorMessage(
  error: unknown,
  fallback = "Request failed",
): string {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  const data = error.response?.data as ApiMessagePayload | undefined;
  const serverMessage = data?.message;
  const status = error.response?.status;

  if (typeof serverMessage === "string" && serverMessage.trim() !== "") {
    return serverMessage;
  }

  if (status === 400) {
    return "Invalid request. Please check your input and try again.";
  }

  if (status === 401) {
    return "Unauthorized access. Please login again.";
  }

  if (status === 500) {
    return "Server error. Please try again later.";
  }

  return fallback;
}
