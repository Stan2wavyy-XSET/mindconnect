import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";

export default function UserConnections() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConnections() {
      try {
        const res = await client.get("/connections");
        setConnections(res.data);
      } catch (err) {
        console.error("Could not load connections", err);
      } finally {
        setLoading(false);
      }
    }
    fetchConnections();
  }, []);

  if (loading) return <p>Loading your connections...</p>;

  const active = connections.filter((c) => c.status === "active");
  const pending = connections.filter((c) => c.status === "pending");

  return (
    <div style={{ marginBottom: 24 }}>
      <h2>Your therapists</h2>

      {active.length === 0 && pending.length === 0 && (
        <p>You haven't connected with a therapist yet — browse therapists below.</p>
      )}

      {active.map((c) => (
        <div key={c._id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, marginBottom: 12 }}>
          <p><strong>{c.therapistId?.name}</strong></p>
          <Link to={`/chat/${c._id}`}>Open chat →</Link>
        </div>
      ))}

      {pending.map((c) => (
        <div key={c._id} style={{ border: "1px solid #eee", borderRadius: 8, padding: 16, marginBottom: 12, color: "#888" }}>
          <p><strong>{c.therapistId?.name}</strong> — waiting for them to accept your request</p>
        </div>
      ))}
    </div>
  );
}