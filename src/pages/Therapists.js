import { useEffect, useState } from "react";
import client from "../api/client";

export default function Therapists() {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestedIds, setRequestedIds] = useState([]); // track which ones we've just requested

  useEffect(() => {
    async function fetchTherapists() {
      try {
        const res = await client.get("/therapists");
        setTherapists(res.data);
      } catch (err) {
        setError("Could not load therapists");
      } finally {
        setLoading(false);
      }
    }
    fetchTherapists();
  }, []);

  async function handleConnect(therapistId) {
    try {
      await client.post("/connections", { therapistId });
      setRequestedIds((prev) => [...prev, therapistId]);
    } catch (err) {
      alert(err.response?.data?.error || "Could not send connection request");
    }
  }

  if (loading) return <p style={{ padding: 24 }}>Loading therapists...</p>;
  if (error) return <p style={{ padding: 24, color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 24 }}>
      <h1>Find a therapist</h1>

      {therapists.length === 0 ? (
        <p>No therapists available yet.</p>
      ) : (
        therapists.map((t) => (
          <div key={t._id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, marginBottom: 12 }}>
            <h3>{t.name}</h3>
            <p>{t.bio}</p>
            <p style={{ color: "#666" }}>
              Specialties: {t.specialties?.join(", ") || "Not specified"}
            </p>
            <p style={{ color: "#666" }}>Session fee: KES {t.sessionFee}</p>

            <button
              onClick={() => handleConnect(t._id)}
              disabled={requestedIds.includes(t._id)}
            >
              {requestedIds.includes(t._id) ? "Request sent" : "Connect"}
            </button>
          </div>
        ))
      )}
    </div>
  );
}