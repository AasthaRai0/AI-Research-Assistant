import axios from "axios";

// Point this at your RAG backend when it's ready.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("lumen_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const documentsApi = {
  list: () => api.get("/documents"),
  upload: (formData, onUploadProgress) =>
    api.post("/documents/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    }),
  remove: (id) => api.delete(`/documents/${id}`),
};

export const chatApi = {
  ask: (docId, message, conversationId) =>
    api.post("/chat/ask", { docId, message, conversationId }),
  listConversations: () => api.get("/chat/conversations"),
  deleteConversation: (id) => api.delete(`/chat/conversations/${id}`),
};

export const authApi = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  signup: (name, email, password) => api.post("/auth/signup", { name, email, password }),
  googleLogin: (idToken) => api.post("/auth/google", { idToken }),
};

export default api;
