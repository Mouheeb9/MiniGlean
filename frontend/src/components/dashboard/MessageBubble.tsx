import React from "react";
import type { ChatMessage } from "../../services/types";

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow ${
          isUser ? "bg-accent text-white" : "bg-white/5 text-gray-200"
        }`}
      >
        <p className="whitespace-pre-line">{message.content || "..."}</p>
        {message.source && !isUser && (
          <p className="mt-2 text-xs text-gray-400">Source: {message.source}</p>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
