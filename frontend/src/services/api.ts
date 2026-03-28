import axios, { AxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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

export const authService = {
  login: async (email: string, password: string) => {
    const form = new URLSearchParams();
    form.append("username", email);
    form.append("password", password);
    const { data } = await api.post("/auth/login", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return data;
  },

  register: async (email: string, password: string, full_name?: string) => {
    const { data } = await api.post("/auth/register", {
      email,
      password,
      full_name,
    });
    return data;
  },
};

export const workspaceService = {
  list: async () => {
    const { data } = await api.get("/workspaces/");
    return data;
  },

  create: async (name: string, description?: string) => {
    const { data } = await api.post("/workspaces/", { name, description });
    return data;
  },

  delete: async (id: string) => {
    await api.delete(`/workspaces/${id}`);
  },
};

export const documentService = {
  list: async (workspaceId: string) => {
    const { data } = await api.get(`/workspaces/${workspaceId}/documents`);
    return data;
  },

  upload: async (workspaceId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post(
      `/workspaces/${workspaceId}/documents`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data;
  },
};