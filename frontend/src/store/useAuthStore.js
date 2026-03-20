import { create } from "zustand";
import { authAPI } from "../services/api";

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  role: localStorage.getItem("role") || "GUEST",
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await authAPI.login({ email, password });
      const { token, user } = res.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role.toUpperCase());
      set({
        user,
        role: user.role.toUpperCase(),
        isAuthenticated: true,
        loading: false,
      });
      return user;
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  signup: async (name, email, password, role) => {
    set({ loading: true, error: null });
    try {
      const res = await authAPI.signup({ name, email, password, role });
      const { token, user } = res.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role.toUpperCase());
      set({
        user,
        role: user.role.toUpperCase(),
        isAuthenticated: true,
        loading: false,
      });
      return user;
    } catch (err) {
      const message = err.response?.data?.message || "Signup failed";
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    set({ user: null, role: "GUEST", isAuthenticated: false, error: null });
  },

  clearError: () => set({ error: null }),
}));
