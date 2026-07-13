import { AuthProvider } from "@refinedev/core";
import axios from "axios";

const API_URL = "http://localhost:3000"; 

export const authProvider: AuthProvider = {
  // Wywoływane podczas próby zalogowania
  login: async ({ email, password }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      if (response.data?.access_token) {
        // Zapisze token oraz dane usera w pamięci przeglądarki
        localStorage.setItem("auth_token", response.data.access_token);
        localStorage.setItem("user_profile", JSON.stringify(response.data.user));
        return {
          success: true,
          redirectTo: "/admin", // Po udanym zalogowaniu przekieruj do panelu
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: "Błąd logowania",
          message: error.response?.data?.message || "Niepoprawny email lub hasło",
        },
      };
    }
    return { success: false };
  },

  // Wywoływane przy wylogowaniu
  logout: async () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_profile");
    return {
      success: true,
      redirectTo: "/login",
    };
  },

  // Wywoływane przy przechodzeniu między podstronami – weryfikuje uprawnienia
  check: async () => {
    const token = localStorage.getItem("auth_token");
    const userProfileString = localStorage.getItem("user_profile");

    if (!token || !userProfileString) {
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }

    try {
      const user = JSON.parse(userProfileString);
      // Jeśli użytkownik nie jest administratorem, wyrzucamy go z panelu administracyjnego
      if (user.status !== "ADMIN") {
        return {
          authenticated: false,
          redirectTo: "/login",
          error: {
            message: "Brak uprawnień! Panel dostępny tylko dla administratorów.",
            name: "Dostęp zabroniony",
          },
        };
      }
      
      return { authenticated: true };
    } catch {
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }
  },

  // Wywoływane, gdy API backendu zwróci błąd 401 lub 403 (np. wygasł token)
  onError: async (error) => {
    const status = error?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_profile");
      return { logout: true, redirectTo: "/login" };
    }
    return { error };
  },

  // Pobieranie aktualnych danych użytkownika do paska bocznego w panelu
  getIdentity: async () => {
    const userProfileString = localStorage.getItem("user_profile");
    if (userProfileString) {
      return JSON.parse(userProfileString);
    }
    return null;
  },
};