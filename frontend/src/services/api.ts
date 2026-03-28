import axios, { AxiosError } from "axios";
import { Token, User, Workspace, Document } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

// Instance Axios partagée
export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Injecte le token JWT automatiquement sur chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirige vers /login si le token est expiré
api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// --- Auth ---
export const authService = {
  login: async (email: string, password: string): Promise<Token> => {
    const form = new URLSearchParams();
    form.append("username", email);
    form.append("password", password);
    const { data } = await api.post<Token>("/auth/login", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return data;
  },

  register: async (
    email: string,
    password: string,
    full_name?: string
  ): Promise<User> => {
    const { data } = await api.post<User>("/auth/register", {
      email,
      password,
      full_name,
    });
    return data;
  },
};

// --- Workspaces ---
export const workspaceService = {
  list: async (): Promise<Workspace[]> => {
    const { data } = await api.get<Workspace[]>("/workspaces/");
    return data;
  },

  create: async (name: string, description?: string): Promise<Workspace> => {
    const { data } = await api.post<Workspace>("/workspaces/", {
      name,
      description,
    });
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/workspaces/${id}`);
  },
};

// --- Documents ---
export const documentService = {
  list: async (workspaceId: string): Promise<Document[]> => {
    const { data } = await api.get<Document[]>(
      `/workspaces/${workspaceId}/documents`
    );
    return data;
  },

  upload: async (workspaceId: string, file: File): Promise<Document> => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post<Document>(
      `/workspaces/${workspaceId}/documents`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data;
  },
};