import { api } from "./api";

export const streamChat = (
  query: string,
  onMessage: (data: string) => void,
  onError: () => void
) => {
  let cancelled = false;

  const tenant = localStorage.getItem("tenant") || "default";

  api
    .post("/api/chat", {
      question: query,
      tenantId: tenant
    })
    .then((res) => {
      if (cancelled) return;
      const answer: string = res.data.answer || "";
      onMessage(answer);
    })
    .catch(() => {
      if (!cancelled) onError();
    });

  return () => {
    cancelled = true;
  };
};