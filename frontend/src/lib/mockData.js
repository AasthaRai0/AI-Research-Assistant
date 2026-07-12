// Central mock data — swap for real API/axios calls when the backend is wired up.

export const initialDocuments = [
  {
    id: "doc-1",
    name: "ML_notes.pdf",
    pages: 42,
    size: "3.2 MB",
    uploadedAt: "2026-07-08T10:12:00Z",
    status: "ready", // uploading | extracting | embedding | ready | error
  },
  {
    id: "doc-2",
    name: "Transformer_Architecture_Survey.pdf",
    pages: 118,
    size: "8.7 MB",
    uploadedAt: "2026-07-09T14:30:00Z",
    status: "ready",
  },
  {
    id: "doc-3",
    name: "Q2_Research_Report.pdf",
    pages: 26,
    size: "1.9 MB",
    uploadedAt: "2026-07-11T09:05:00Z",
    status: "ready",
  },
];

export const initialConversations = [
  {
    id: "conv-1",
    title: "Gradient descent explained",
    docId: "doc-1",
    updatedAt: "2026-07-11T16:40:00Z",
    messages: [
      {
        id: "m1",
        role: "user",
        content: "What is gradient descent?",
      },
      {
        id: "m2",
        role: "assistant",
        content:
          "According to your uploaded **Machine Learning notes**, gradient descent is an iterative optimization algorithm used to minimize a loss function by repeatedly moving in the direction of steepest descent, defined by the negative of the gradient.\n\n```python\nfor step in range(epochs):\n    grad = compute_gradient(loss, weights)\n    weights = weights - learning_rate * grad\n```\n\nThe **learning rate** controls the step size — too high and the algorithm overshoots the minimum; too low and convergence is slow.",
        sources: [
          { doc: "ML_notes.pdf", page: 23 },
          { doc: "ML_notes.pdf", page: 24 },
        ],
      },
    ],
  },
  {
    id: "conv-2",
    title: "Self-attention vs. RNNs",
    docId: "doc-2",
    updatedAt: "2026-07-10T11:15:00Z",
    messages: [
      {
        id: "m1",
        role: "user",
        content: "How does self-attention differ from recurrent architectures?",
      },
      {
        id: "m2",
        role: "assistant",
        content:
          "Your **Transformer Architecture Survey** explains that self-attention computes relationships between all tokens in a sequence in parallel, rather than sequentially like RNNs. This removes the vanishing-gradient bottleneck and enables much longer effective context windows.",
        sources: [{ doc: "Transformer_Architecture_Survey.pdf", page: 7 }],
      },
    ],
  },
  {
    id: "conv-3",
    title: "Summarize Q2 findings",
    docId: "doc-3",
    updatedAt: "2026-07-09T08:20:00Z",
    messages: [
      {
        id: "m1",
        role: "user",
        content: "Summarize the key findings from the Q2 report.",
      },
      {
        id: "m2",
        role: "assistant",
        content:
          "The **Q2 Research Report** highlights three key findings: a 34% increase in retrieval accuracy after switching embedding models, reduced latency from caching frequent queries, and improved citation precision across long documents.",
        sources: [{ doc: "Q2_Research_Report.pdf", page: 4 }],
      },
    ],
  },
];

export const activityFeed = [
  { id: "a1", type: "upload", label: "Uploaded Q2_Research_Report.pdf", time: "2 hours ago" },
  { id: "a2", type: "chat", label: "Asked about self-attention mechanisms", time: "1 day ago" },
  { id: "a3", type: "upload", label: "Uploaded Transformer_Architecture_Survey.pdf", time: "2 days ago" },
  { id: "a4", type: "chat", label: "Asked 5 questions about ML_notes.pdf", time: "3 days ago" },
];

export const aiModels = [
  { id: "lumen-pro", name: "Lumen Pro", description: "Best for deep research and long documents" },
  { id: "lumen-fast", name: "Lumen Fast", description: "Optimized for quick, everyday questions" },
  { id: "lumen-precise", name: "Lumen Precise", description: "Maximizes citation accuracy" },
];

export function formatRelativeDate(iso) {
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  const diffH = Math.round(diffMs / 3600000);
  if (diffH < 1) return "Just now";
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.round(diffH / 24);
  return `${diffD}d ago`;
}
