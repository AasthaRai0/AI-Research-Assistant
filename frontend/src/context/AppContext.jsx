import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { initialDocuments, initialConversations } from "../lib/mockData";

const AppContext = createContext(null);

const PROCESSING_STEPS = ["uploading", "extracting", "embedding", "ready"];

export function AppProvider({ children }) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [conversations, setConversations] = useState(initialConversations);
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState({ name: "Alex Rivera", email: "alex@lumen.ai" });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  const addDocuments = useCallback((files) => {
    const newDocs = files.map((file, i) => ({
      id: `doc-${Date.now()}-${i}`,
      name: file.name,
      pages: Math.floor(Math.random() * 80) + 8,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadedAt: new Date().toISOString(),
      status: "uploading",
    }));
    setDocuments((prev) => [...newDocs, ...prev]);

    newDocs.forEach((doc) => {
      PROCESSING_STEPS.forEach((step, idx) => {
        setTimeout(() => {
          setDocuments((prev) =>
            prev.map((d) => (d.id === doc.id ? { ...d, status: step } : d))
          );
        }, (idx + 1) * 1100);
      });
    });
  }, []);

  const deleteConversation = useCallback((id) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const addMessageToConversation = useCallback((convId, message) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? { ...c, messages: [...c.messages, message], updatedAt: new Date().toISOString() }
          : c
      )
    );
  }, []);

  const createConversation = useCallback((docId, title) => {
    const conv = {
      id: `conv-${Date.now()}`,
      title: title || "New conversation",
      docId,
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    setConversations((prev) => [conv, ...prev]);
    return conv.id;
  }, []);

  const totalQueries = conversations.reduce(
    (sum, c) => sum + c.messages.filter((m) => m.role === "user").length,
    0
  );

  const value = {
    documents,
    setDocuments,
    addDocuments,
    conversations,
    setConversations,
    deleteConversation,
    addMessageToConversation,
    createConversation,
    theme,
    setTheme,
    user,
    setUser,
    totalQueries,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
