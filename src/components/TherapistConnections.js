import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import client from "../api/client";


export default function TherapistConnections() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchConnections() {
    setLoading(true);
    try {
      const res = await client.get("/connections");
      setConnections(res.data);
    } catch (err) {
      setError("Could not load connection requests");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchConnections();
  }, []);

  async function handleAccept(id) {
    try {
      await client.patch(`/connections/${id}/accept`);
      fetchConnections(); // refresh the list to show the updated status
    } catch (err) {
      alert(err.response?.data?.error || "Could not accept connection");
    }
  }

  async function handleDecline(id) {
    try {
      await client.patch(`/connections/${id}/decline`);
      fetchConnections();
    } catch (err) {
      alert(err.response?.data?.error || "Could not decline connection");
    }
  }

  if (loading) return <p>Loading connection requests...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const pending = connections.filter((c) => c.status === "pending");
  const active = connections.filter((c) => c.status === "active");

  return (
    <div>
      <h2>Pending requests</h2>
      {pending.length === 0 ? (
        <p>No pending requests right now.</p>
      ) : (
        pending.map((c) => (
          <div key={c._id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, marginBottom: 12 }}>
            <p><strong>{c.userId?.name}</strong> ({c.userId?.email})</p>
            <button onClick={() => handleAccept(c._id)} style={{ marginRight: 8 }}>Accept</button>
            <button onClick={() => handleDecline(c._id)}>Decline</button>
          </div>
        ))
      )}

      <h2 style={{ marginTop: 24 }}>Active connections</h2>
      {active.length === 0 ? (
        <p>No active connections yet.</p>
      ) : (
       active.map((c) => (
  <div key={c._id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, marginBottom: 12 }}>
    <p><strong>{c.userId?.name}</strong> ({c.userId?.email})</p>
    <Link to={`/chat/${c._id}`}>Open chat →</Link>
  </div>
))
      )}
    </div>
  );
}