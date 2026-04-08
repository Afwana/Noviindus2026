import { api } from "@/utils/api";
import { clearAuth } from "./auth-storage";

export async function logoutUser(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } catch {
    // Even if API logout fails, clear local session.
  } finally {
    clearAuth();
    if (typeof window !== "undefined") {
      localStorage.removeItem("examResult");
    }
  }
}
