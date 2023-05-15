import { AuthProvider, HttpError } from "react-admin";

export interface AuthResponse {
  access_token: string,
  role: string,
  name: string,
  id: string,
}

export function rejectAuth() {
  return Promise.reject(new HttpError("Авторизуйтесь", 401));
}

export const localStorageKey = 'identity';

const authUrl = "http://localhost:3000/api";

const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const request = new Request(`${authUrl}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email: username, password: password }),
      headers: new Headers({ "Content-Type": "application/json" })
    });

    try {
      const response = await fetch(request);
      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.statusText);
      }

      const data: AuthResponse | undefined | null = await response.json()
      // const auth = await response.json();
      if (!data) throw new Error("No payload");
      localStorage.setItem(localStorageKey, JSON.stringify(data));
    } catch {
      throw new Error("Network error");
    }
  },

  logout: async () => {
    localStorage.removeItem(localStorageKey);
    return Promise.resolve();
  },

  checkAuth: async () => {
    const identity = localStorage.getItem(localStorageKey);
    if (identity && JSON.parse(identity)) {
      return JSON.parse(identity) ? Promise.resolve() : Promise.reject();
    } else return Promise.reject();
  },

  checkError: async (error) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem(localStorageKey);
      return Promise.reject();
    }
    // other error code (404, 500, etc): no need to log out
    return Promise.resolve();
  },

  getIdentity: async () => {
    const identity = localStorage.getItem(localStorageKey);
    if (identity && JSON.parse(identity)) {
        const structuredIdentity: AuthResponse = JSON.parse(identity);
        return Promise.resolve({
          id: structuredIdentity.id,
          fullName: structuredIdentity.name,
        });
      }
    return Promise.reject();

  },

  getPermissions: async () => {
    const identity = localStorage.getItem(localStorageKey);
    if (identity && JSON.parse(identity)) {
      return (JSON.parse(identity) && JSON.parse(identity).role)
        ? Promise.resolve(JSON.parse(identity).role)
        : Promise.reject();
    } else return rejectAuth();
  }
};

export default authProvider;
