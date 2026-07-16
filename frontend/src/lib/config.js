// Static UI options — not fetched from the backend. The backend's LLM_PROVIDER
// / LLM_MODEL env vars control what actually answers questions server-side;
// this list is a client-side preference placeholder until a per-user model
// setting exists on the API.
export const aiModels = [
  { id: "default", name: "Default", description: "Uses the model configured on the server" },
  { id: "precise", name: "Precise", description: "Prioritizes citation accuracy over speed" },
  { id: "fast", name: "Fast", description: "Optimized for quick, everyday questions" },
];
