"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, CheckCircle, Rocket } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { track } from "@vercel/analytics";
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
  const [limitError, setLimitError] = useState<string | null>(null);
  const [completedBlueprint, setCompletedBlueprint] = useState<AppBlueprint | null>(null);
  const [currentProjectId, setCurrentProjectId] = useState(projectId);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, completedBlueprint]);

  async function sendMessage() {
    if (!input.trim() || loading || completedBlueprint) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setLimitError(null);

    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: currentProjectId,
          message: userMessage.content,
        }),
      });

      if (res.status === 402) {
        const data = await res.json();
        setLimitError(data.message ?? "Build limit reached. Please upgrade.");
        track("build_limit_reached", { plan: data.plan ?? "unknown" });
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (data.projectId && !currentProjectId) {
        setCurrentProjectId(data.projectId);
        onProjectCreated(data.projectId);
        track("intake_started", { projectId: data.projectId });
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Blueprint complete — lock the chat and show completion card
      if (data.isComplete && data.blueprint) {
        track("intake_complete", {
          projectId: data.projectId,
          appName: data.blueprint.appName ?? "unknown",
        });
        setCompletedBlueprint(data.blueprint);
      }
    } catch {
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
              <div className="w-7 h-7 rounded-full bg-terra/10 flex items-center justify-center text-xs shrink-0 mr-2 mt-0.5 text-terra font-bold">
                ✦
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-navy text-white rounded-br-sm"
                  : "bg-cream border border-border text-ink rounded-bl-sm"
              }`}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-terra/10 flex items-center justify-center text-xs shrink-0 mr-2 mt-0.5 text-terra">
              ✦
            </div>
            <div className="px-4 py-3 rounded-2xl bg-cream border border-border">
              <Loader2 size={16} className="text-terra animate-spin" />
            </div>
          </div>
        )}

        {/* Blueprint completion card — locks chat and prompts next step */}
        {completedBlueprint && (
          <div className="w-full mt-2">
            <div className="rounded-2xl border border-terra/30 bg-terra/5 p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-terra/15 shrink-0 mt-0.5">
                  <CheckCircle size={18} className="text-terra" />
                </div>
                <div>
                  <p className="font-semibold text-navy text-sm">
                    Blueprint ready for{" "}
                    <span className="text-terra">{completedBlueprint.appName}</span>
                  </p>
                  <p className="text-xs text-ink-lighter mt-0.5">
                    IdeaLaunch will generate and deploy your app automatically.
                    Review the plan first, then approve to build.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onComplete(completedBlueprint)}
                className="w-full flex items-center justify-center gap-2 bg-terra hover:bg-terra/90 text-white font-semibold py-3 px-5 rounded-xl transition-colors text-sm"
              >
                <Rocket size={15} />
                Review blueprint &amp; build my app →
              </button>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Limit error banner */}
      {limitError && (
        <div className="mx-4 mb-3 px-4 py-3 bg-terra/10 border border-terra/20 rounded-xl text-sm text-terra">
          <strong>Build limit reached.</strong> {limitError}{" "}
          <button
            onClick={async () => {
              const res = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan: "starter" }),
              });
              const data = await res.json();
              if (data.url) window.location.href = data.url;
            }}
            className="underline font-semibold ml-1"
          >
            Upgrade now →
          </button>
        </div>
      )}

      {/* Input area — hidden once blueprint is complete */}
      {!completedBlueprint && (
        <div className="p-4 border-t border-border">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your app idea..."
              rows={1}
              disabled={!!limitError}
              className="flex-1 resize-none bg-cream-dark border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder-ink-lighter focus:outline-none focus:border-terra/50 transition-colors disabled:opacity-50"
              style={{ minHeight: "44px", maxHeight: "120px" }}
              onInput={(e) => {
                const t = e.currentTarget;
                t.style.height = "auto";
                t.style.height = t.scrollHeight + "px";
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading || !!limitError}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-terra hover:bg-terra-dark disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors shrink-0"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-xs text-ink-lighter mt-2 text-center">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      )}
    </div>
  );
}
