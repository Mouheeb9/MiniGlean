import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "../services/types";
import { streamChat } from "../services/chat";

export const useStream = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const closeRef = useRef<(() => void) | null>(null);

  const sendMessage = useCallback((query: string) => {
    if (!query.trim()) return;
    setError(null);
    setStreaming(true);

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: query
    };

    setMessages((prev) => [...prev, userMessage, { id: crypto.randomUUID(), role: "assistant", content: "" }]);

    closeRef.current = streamChat(
      query,
      (data) => {
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last?.role === "assistant") {
            last.content += data;
          }
          return updated;
        });
      },
      () => {
        setError("Streaming disconnected");
        setStreaming(false);
      }
    );
  }, []);

  const stopStream = useCallback(() => {
    closeRef.current?.();
    setStreaming(false);
  }, []);

  useEffect(() => () => closeRef.current?.(), []);

  return {
    messages,
    streaming,
    error,
    sendMessage,
    stopStream
  };
};
