import { useEffect, useState } from "react";
import client from "../api/client";

export default function MoodHistory({ refreshKey }) {
  const [checkIns, setCheckIns] = useState([]);
  const [flagged, setFlagged] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [historyRes, flagRes] = await Promise.all([
          client.get("/checkins"),
          client.get("/checkins/flag"),
        ]);
        setCheckIns(historyRes.data);
        setFlagged(flagRes.data.flagged);
      } catch (err) {
        console.error("Could not load check-in history", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [refreshKey]); // re-runs whenever refreshKey changes (i.e. after a new check-in)

  if (loading) return <p>Loading your history...</p>;

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
      <h2>Your mood history</h2>

      {flagged && (
        <div style={{ background: "#fff3cd", padding: 12, borderRadius: 6, marginBottom: 12 }}>
          We've noticed your mood has been low for a few days. Consider reaching out to your therapist,
          or a trusted person, about how you're feeling.
        </div>
      )}

      {checkIns.length === 0 ? (
        <p>No check-ins yet — log your first one above.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {checkIns.map((c) => (
            <li key={c._id} style={{ borderBottom: "1px solid #eee", padding: "8px 0" }}>
              <strong>Mood: {c.mood}/5</strong> — {new Date(c.createdAt).toLocaleDateString()}
              {c.note && <p style={{ margin: "4px 0 0", color: "#555" }}>{c.note}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}