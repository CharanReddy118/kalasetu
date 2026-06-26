import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

const roleLabels = { artisan: "Artisan", youth: "Skilled Youth", buyer: "Buyer" };

function initials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}

function timeOf(ts) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Chat() {
  const { user } = useAuth();
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loadingConvos, setLoadingConvos] = useState(true);
  const bottomRef = useRef(null);

  // Load conversations with the other person's name, role, and last message.
  useEffect(() => {
    if (!user) {
      setLoadingConvos(false);
      return;
    }
    async function loadConversations() {
      const { data: convos } = await supabase
        .from("conversations")
        .select("*")
        .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (!convos || convos.length === 0) {
        setConversations([]);
        setLoadingConvos(false);
        return;
      }

      const otherIds = convos.map((c) =>
        c.user_a === user.id ? c.user_b : c.user_a
      );
      const convoIds = convos.map((c) => c.id);

      // Other people's profiles (name + role).
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, role")
        .in("id", otherIds);

      const profById = {};
      (profiles || []).forEach((p) => {
        profById[p.id] = p;
      });

      // Latest message per conversation.
      const { data: msgs } = await supabase
        .from("messages")
        .select("conversation_id, content, created_at")
        .in("conversation_id", convoIds)
        .order("created_at", { ascending: false });

      const lastByConvo = {};
      (msgs || []).forEach((m) => {
        if (!lastByConvo[m.conversation_id]) lastByConvo[m.conversation_id] = m.content;
      });

      setConversations(
        convos.map((c) => {
          const otherId = c.user_a === user.id ? c.user_b : c.user_a;
          const p = profById[otherId];
          return {
            id: c.id,
            otherName: p?.full_name || "User",
            otherRole: p?.role || null,
            lastMessage: lastByConvo[c.id] || "No messages yet",
          };
        })
      );
      setLoadingConvos(false);
    }
    loadConversations();
  }, [user]);

  // Load messages + subscribe to live updates for the open conversation.
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }
    async function loadMessages() {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });
      setMessages(data || []);
    }
    loadMessages();

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) =>
            prev.find((m) => m.id === payload.new.id)
              ? prev
              : [...prev, payload.new]
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const trimmed = text.trim();
    if (!trimmed || !conversationId) return;
    setText("");
    await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: trimmed,
    });
  }

  const activeConvo = conversations.find((c) => c.id === conversationId);

  if (!user)
    return (
      <p className="text-center py-16 text-gray-600">Please log in to chat.</p>
    );

  return (
    <div className="py-4">
      <h2 className="text-3xl font-bold text-kala-charcoal mb-6">Messages</h2>
      <div
        className="grid md:grid-cols-3 bg-white rounded-xl shadow-sm overflow-hidden"
        style={{ minHeight: "70vh" }}
      >
        {/* Left: conversation list */}
        <div className="border-r border-gray-100 overflow-y-auto">
          {loadingConvos ? (
            <p className="p-4 text-gray-500">Loading...</p>
          ) : conversations.length === 0 ? (
            <p className="p-4 text-gray-500 text-sm">
              No conversations yet. Start one from a product or opportunity.
            </p>
          ) : (
            conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => navigate(`/chat/${c.id}`)}
                className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-kala-cream transition ${
                  c.id === conversationId ? "bg-kala-cream" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-kala-green text-white flex items-center justify-center font-semibold shrink-0">
                    {initials(c.otherName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-kala-charcoal truncate">
                        {c.otherName}
                      </span>
                      {c.otherRole && (
                        <span className="text-[10px] bg-kala-cream text-kala-green px-2 py-0.5 rounded-full shrink-0">
                          {roleLabels[c.otherRole] || c.otherRole}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {c.lastMessage}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Right: messages + input */}
        <div className="md:col-span-2 flex flex-col">
          {!conversationId ? (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a conversation
            </div>
          ) : (
            <>
              {/* header with the active person */}
              {activeConvo && (
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                  <div className="w-9 h-9 rounded-full bg-kala-green text-white flex items-center justify-center text-sm font-semibold">
                    {initials(activeConvo.otherName)}
                  </div>
                  <div>
                    <p className="font-medium text-kala-charcoal leading-tight">
                      {activeConvo.otherName}
                    </p>
                    {activeConvo.otherRole && (
                      <p className="text-xs text-gray-400">
                        {roleLabels[activeConvo.otherRole] || activeConvo.otherRole}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div
                className="flex-1 overflow-y-auto p-4 space-y-2"
                style={{ maxHeight: "55vh" }}
              >
                {messages.map((m) => {
                  const mine = m.sender_id === user.id;
                  return (
                    <div
                      key={m.id}
                      className={`flex ${mine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] px-3 py-2 text-sm shadow-sm ${
                          mine
                            ? "bg-kala-orange text-white rounded-2xl rounded-br-sm"
                            : "bg-gray-100 text-kala-charcoal rounded-2xl rounded-bl-sm"
                        }`}
                      >
                        <p>{m.content}</p>
                        <p
                          className={`text-[10px] mt-1 ${
                            mine ? "text-orange-100" : "text-gray-400"
                          }`}
                        >
                          {timeOf(m.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              <div className="border-t border-gray-100 p-3 flex gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-kala-orange"
                />
                <button
                  onClick={handleSend}
                  className="bg-kala-orange text-white px-5 py-2 rounded-lg hover:bg-[#a8551f] transition"
                >
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;