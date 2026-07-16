import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { authApi, documentsApi, chatApi } from "../lib/api";

const AppContext = createContext(null);

// Documents in these states are still processing — poll until they settle.
const IN_PROGRESS_STATUSES = ["uploading", "extracting", "embedding"];

// Backend returns { id, filename, status, page_count, error_message, created_at }.
// UI components expect { name, pages, uploadedAt } — normalize once here so
// every consumer (DocumentCard, Dashboard, Chat) can stay backend-agnostic.
function normalizeDocument(raw) {
  return {
    id: raw.id,
    name: raw.filename,
    pages: raw.page_count ?? 0,
    status: raw.status,
    errorMessage: raw.error_message,
    uploadedAt: raw.created_at,
  };
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("lumen_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [authLoading, setAuthLoading] = useState(true);

  const [documents, setDocuments] = useState([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);

  const [chatHistory, setChatHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [theme, setTheme] = useState("light");

  const pollTimers = useRef({});

  const isAuthenticated = Boolean(user && localStorage.getItem("lumen_token"));

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  // --- Bootstrapping: if a token exists, verify it and load initial data ---
  useEffect(() => {
    const token = localStorage.getItem("lumen_token");
    if (!token) {
      setAuthLoading(false);
      return;
    }
    authApi
      .me()
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("lumen_user", JSON.stringify(res.data));
      })
      .catch(() => {
        localStorage.removeItem("lumen_token");
        localStorage.removeItem("lumen_user");
        setUser(null);
      })
      .finally(() => setAuthLoading(false));
  }, []);

  // Load documents + history once authenticated.
  useEffect(() => {
    if (isAuthenticated) {
      refreshDocuments();
      refreshHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // --- Auth actions ---
  const login = useCallback(async (email, password) => {
    const res = await authApi.login(email, password);
    localStorage.setItem("lumen_token", res.data.access_token);
    localStorage.setItem("lumen_user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const signup = useCallback(async (name, email, password) => {
    const res = await authApi.signup(name, email, password);
    localStorage.setItem("lumen_token", res.data.access_token);
    localStorage.setItem("lumen_user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("lumen_token");
    localStorage.removeItem("lumen_user");
    setUser(null);
    setDocuments([]);
    setChatHistory([]);
    Object.values(pollTimers.current).forEach(clearTimeout);
    pollTimers.current = {};
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const res = await authApi.updateProfile(payload);
    setUser(res.data);
    localStorage.setItem("lumen_user", JSON.stringify(res.data));
    return res.data;
  }, []);

  // --- Documents ---
  const refreshDocuments = useCallback(async () => {
    setDocumentsLoading(true);
    try {
      const res = await documentsApi.list();
      const normalized = res.data.map(normalizeDocument);
      setDocuments(normalized);
      // Resume polling for anything still processing (e.g. after a page refresh).
      normalized.forEach((doc) => {
        if (IN_PROGRESS_STATUSES.includes(doc.status)) pollDocumentStatus(doc.id);
      });
    } finally {
      setDocumentsLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const pollDocumentStatus = useCallback((docId) => {
    if (pollTimers.current[docId]) return; // already polling

    const tick = async () => {
      try {
        const res = await documentsApi.get(docId);
        const normalized = normalizeDocument(res.data);
        setDocuments((prev) => prev.map((d) => (d.id === docId ? normalized : d)));
        if (IN_PROGRESS_STATUSES.includes(normalized.status)) {
          pollTimers.current[docId] = setTimeout(tick, 1500);
        } else {
          delete pollTimers.current[docId];
        }
      } catch {
        delete pollTimers.current[docId];
      }
    };
    pollTimers.current[docId] = setTimeout(tick, 1500);
  }, []);

  const uploadDocuments = useCallback(
    async (files) => {
      for (const file of files) {
        const res = await documentsApi.upload(file);
        setDocuments((prev) => [
          normalizeDocument({ ...res.data, page_count: 0, created_at: new Date().toISOString() }),
          ...prev,
        ]);
        pollDocumentStatus(res.data.id);
      }
    },
    [pollDocumentStatus]
  );

  const deleteDocument = useCallback(async (id) => {
    await documentsApi.remove(id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  }, []);

  // --- Chat ---
  const refreshHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await chatApi.history();
      setChatHistory(res.data);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const askQuestion = useCallback(async (documentId, question) => {
    const res = await chatApi.ask(documentId, question);
    // Backend doesn't return the persisted entry's id/timestamp directly,
    // so refresh history in the background to pick up the canonical record
    // (including its id, needed for delete) without blocking the UI.
    refreshHistory();
    return res.data; // { answer, sources }
  }, [refreshHistory]);

  const deleteHistoryEntry = useCallback(async (id) => {
    await chatApi.deleteEntry(id);
    setChatHistory((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const totalQueries = chatHistory.length;

  const value = {
    // auth
    user,
    authLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    updateProfile,
    // documents
    documents,
    documentsLoading,
    uploadDocuments,
    deleteDocument,
    refreshDocuments,
    // chat
    chatHistory,
    historyLoading,
    askQuestion,
    deleteHistoryEntry,
    refreshHistory,
    totalQueries,
    // theme
    theme,
    setTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
