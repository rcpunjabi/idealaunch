"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { Message, AppBlueprint } from "@/types";

interface ChatInterfaceProps {
  projectId: string | null;
  onProjectCreated: (id: string) => void;
  onComplete: (blueprint: AppBlueprint) => void;
}

export default function ChatInterface({
  projectId,
  onProjectCreated,
  onComplete,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hey! 👋 I'm here to help turn your idea into a real, live app.\n\nTell me about it — what do you want to build? Don't worry about being technical. Just describe it like you'd explain it to a friend.",
      createdAt: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(projectId);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: currentProjectId,
          message: userMessage.content,
        }),
      });

      const data = await res.json();

      // Track the project ID after it's created
      if (data.projectId && !currentProjectId) {
        setCurrentProjectId(data.projectId);
        onProjectCreated(data.projectId);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Blueprint complete — advance to next step
      if (data.isComplete && data.blueprint) {
        setTimeout(() => onComplete(data.blueprint), 800);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: "err",
          role: "assistant",
          content: "Something went wrong. Please try again.",
          createdAt: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-violet/20 flex items-center justify-center text-xs shrink-0 mr-2 mt-0.5">
                ✦
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-violet text-white rounded-br-sm"
                  : "bg-surface-raised border border-surface-border text-white/90 rounded-bl-sm"
              }`}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-violet/20 flex items-center justify-center text-xs shrink-0 mr-2 mt-0.5">
              ✦
            </div>
            <div className="px-4 py-3 rounded-2xl bg-surface-raised border border-surface-border">
              <Loader2 size={16} className="text-violet animate-spin" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-surface-border">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your app idea..."
            rows={1}
            className="flex-1 resize-none bg-surface-raised border border-surface-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet/50 transition-colors"
            style={{ minHeight: "44px", maxHeight: "120px" }}
            onInput={(e) => {
              const t = e.currentTarget;
              t.style.height = "auto";
              t.style.height = t.scrollHeight + "px";
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet hover:bg-violet-dark disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-xs text-white/30 mt-2 text-center">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
