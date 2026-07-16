import axios from "axios";

// Points at the FastAPI backend (see /backend). Override in .env with
// VITE_API_BASE_URL if it's running somewhere other than localhost:8000.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

// Attach the JWT to every request once the user is logged in.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("lumen_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the token is invalid/expired, the backend returns 401 — clear the
// stale session and send the user back to login instead of leaving them
// stuck on a broken authenticated page.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("lumen_token");
      localStorage.removeItem("lumen_user");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const documentsApi = {
  list: () => api.get("/documents"),
  get: (id) => api.get(`/documents/${id}`),
  upload: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/documents/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  remove: (id) => api.delete(`/documents/${id}`),
};

export const chatApi = {
  // Backend RAG endpoint: { question, document_id } -> { answer, sources }
  ask: (documentId, question) => api.post("/chat", { question, document_id: documentId }),
  history: () => api.get("/chat/history"),
  deleteEntry: (id) => api.delete(`/chat/${id}`),
};

export const authApi = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  signup: (name, email, password) => api.post("/auth/signup", { name, email, password }),
  me: () => api.get("/users/me"),
  updateProfile: (payload) => api.patch("/users/me", payload),
};

export default api;
