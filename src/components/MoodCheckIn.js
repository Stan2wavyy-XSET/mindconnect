import { useState } from "react";
import client from "../api/client";

export default function MoodCheckIn({ onCheckInSaved }) {
  const [mood, setMood] = useState(3);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await client.post("/checkins", { mood: Number(mood), note });
      setNote("");
      setMood(3);
      setSuccess(true);
      onCheckInSaved(); // tells the parent (Dashboard) to refresh history
    } catch (err) {
      setError(err.response?.data?.error || "Could not save check-in");
    } finally {
      setLoading(false);
    }
  }

  const moodLabels = { 1: "Very low", 2: "Low", 3: "Okay", 4: "Good", 5: "Great" };

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, marginBottom: 24 }}>
      <h2>How are you feeling today?</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Mood: {moodLabels[mood]}</label>
          <input
            type="range"
            min="1"
            max="5"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Note (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={500}
            rows={3}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>Check-in saved!</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save check-in"}
        </button>
      </form>
    </div>
  );
}