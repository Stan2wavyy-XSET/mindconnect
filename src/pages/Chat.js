import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import client from "../api/client";
import { getSocket } from "../api/socket";
import { useAuth } from "../context/AuthContext";

export default function Chat() {
  const { connectionId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  const myId = String(user?.id);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await client.get(`/messages/${connectionId}`);
        setMessages(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "Could not load chat history");
      } finally {
        setLoading(false);
      }
    }
    loadHistory();

    const socket = getSocket();
    socket.emit("joinRoom", connectionId);

    function handleNewMessage(msg) {
      if (String(msg.connectionId) === String(connectionId)) {
        setMessages((prev) => [...prev, msg]);
      }
    }
    function handleSocketError(err) {
      setError(err);
    }

    socket.on("newMessage", handleNewMessage);
    socket.on("errorMessage", handleSocketError);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("errorMessage", handleSocketError);
    };
  }, [connectionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const socket = getSocket();
    socket.emit("sendMessage", { connectionId, text });
    setText("");
  }

  if (loading) return <p style={{ padding: 24 }}>Loading chat...</p>;

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 24 }}>
      <p><Link to="/dashboard">← Back to dashboard</Link></p>
      <h1>Chat</h1>
      <p style={{ fontSize: 12, color: "#999" }}>Logged in as: {user?.name} (id: {myId})</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ border: "1px solid #ddd", borderRadius: 8, height: 400, overflowY: "auto", padding: 12, marginBottom: 12 }}>
        {messages.map((m) => {
          const isMine = String(m.senderId) === myId;
          return (
            <div key={m._id} style={{ textAlign: isMine ? "right" : "left", marginBottom: 8 }}>
              <span
                style={{
                  display: "inline-block",
                  background: isMine ? "#dcf8c6" : "#eee",
                  padding: "6px 12px",
                  borderRadius: 12,
                }}
              >
                {m.text}
              </span>
              <div style={{ fontSize: 10, color: "#aaa" }}>sender: {String(m.senderId)}</div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} style={{ display: "flex", gap: 8 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
