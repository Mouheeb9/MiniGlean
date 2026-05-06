import React from "react";
import type { ChatMessage } from "../../services/types";

interface MessageBubbleProps {
  message: ChatMessage;
}

// Simple markdown renderer without external dependencies
const renderMarkdown = (content: string) => {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let tableBuffer: string[] = [];
  let inTable = false;

  const flushTable = (key: string) => {
    if (tableBuffer.length < 2) {
      tableBuffer.forEach((l, i) =>
        elements.push(<p key={`${key}-p-${i}`} className="mb-1">{l}</p>)
      );
      tableBuffer = [];
      return;
    }
    const headers = tableBuffer[0].split("|").map(h => h.trim()).filter(Boolean);
    const rows = tableBuffer.slice(2).map(r =>
      r.split("|").map(c => c.trim()).filter(Boolean)
    );
    elements.push(
      <div key={key} className="overflow-x-auto my-2">
        <table className="text-xs w-full border-collapse">
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="border border-white/20 px-2 py-1 bg-white/10 text-left font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? "bg-white/5" : ""}>
                {row.map((cell, ci) => (
                  <td key={ci} className="border border-white/10 px-2 py-1">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableBuffer = [];
  };

  lines.forEach((line, idx) => {
    const key = `line-${idx}`;

    if (line.startsWith("|")) {
      inTable = true;
      tableBuffer.push(line);
      return;
    }

    if (inTable) {
      flushTable(`table-${idx}`);
      inTable = false;
    }

    if (line.startsWith("### ")) {
      elements.push(<h3 key={key} className="font-semibold text-white mt-3 mb-1">{line.slice(4)}</h3>);
    } else if (line.startsWith("## ")) {
      elements.push(<h2 key={key} className="font-bold text-white mt-3 mb-1">{line.slice(3)}</h2>);
    } else if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(<p key={key} className="font-semibold text-white mb-1">{line.slice(2, -2)}</p>);
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(
        <li key={key} className="ml-4 mb-0.5 list-disc">
          {line.slice(2).replace(/\*\*(.*?)\*\*/g, "$1")}
        </li>
      );
    } else if (line.trim() === "") {
      elements.push(<div key={key} className="h-2" />);
    } else {
      const formatted = line.replace(/\*\*(.*?)\*\*/g, (_, m) => `§BOLD§${m}§END§`);
      const parts = formatted.split(/(§BOLD§.*?§END§)/g);
      elements.push(
        <p key={key} className="mb-1 leading-relaxed">
          {parts.map((part, pi) => {
            if (part.startsWith("§BOLD§") && part.endsWith("§END§")) {
              return <strong key={pi}>{part.slice(6, -5)}</strong>;
            }
            return part;
          })}
        </p>
      );
    }
  });

  if (inTable) flushTable("table-end");

  return elements;
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow ${isUser ? "bg-accent text-white" : "bg-white/5 text-gray-200"
          }`}
      >
        {isUser ? (
          <p>{message.content || "..."}</p>
        ) : (
          <div className="space-y-0.5">
            {message.content
              ? renderMarkdown(message.content)
              : <span className="animate-pulse text-gray-400">...</span>
            }
          </div>
        )}
        {message.source && !isUser && (
          <p className="mt-2 text-xs text-gray-400 border-t border-white/10 pt-2">
            Source: {message.source}
          </p>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
