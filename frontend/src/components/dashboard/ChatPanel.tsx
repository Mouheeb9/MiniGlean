import React, { useEffect, useRef, useState } from "react";
import { useStream } from "../../hooks/useStream";
import MessageBubble from "./MessageBubble";

const ChatPanel: React.FC = () => {
  const { messages, streaming, error, sendMessage, stopStream } = useStream();
  const [query, setQuery] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    sendMessage(query);
    setQuery("");
  };

  return (
    <section className="flex h-full flex-col rounded-2xl bg-panel">
      <div className="border-b border-white/10 px-6 py-4">
        <h2 className="text-lg font-semibold">AI Assistant</h2>
        <p className="text-xs text-gray-400">RAG active · streaming responses</p>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
        {messages.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300">
            Ask a question about your knowledge base to get started.
          </div>
        )}
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={endRef} />
      </div>
      {error && <p className="px-6 text-xs text-red-400">{error}</p>}
      <form onSubmit={submit} className="border-t border-white/10 px-6 py-4">
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ask a question about your documents..."
            className="flex-1 rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
            disabled={streaming}
          />
          <button
            type="submit"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
            disabled={streaming || !query.trim()}
          >
            Send
          </button>
          {streaming && (
            <button
              type="button"
              className="rounded-lg border border-white/10 px-3 py-2 text-xs text-gray-300"
              onClick={stopStream}
            >
              Stop
            </button>
          )}
        </div>
        <p className="mt-3 text-xs text-gray-500">
          AI can make mistakes. Verify important information.
        </p>
      </form>
    </section>
  );
};

export default ChatPanel;
