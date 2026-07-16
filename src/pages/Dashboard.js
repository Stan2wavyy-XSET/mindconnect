import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MoodCheckIn from "../components/MoodCheckIn";
import MoodHistory from "../components/MoodHistory";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  function handleCheckInSaved() {
    setRefreshKey((prev) => prev + 1);
  }

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1>Welcome, {user?.name}</h1>
        <button onClick={logout}>Log out</button>
      </div>

      {user?.role === "user" && (
        <>
          <p><Link to="/therapists">Browse therapists →</Link></p>
          <MoodCheckIn onCheckInSaved={handleCheckInSaved} />
          <MoodHistory refreshKey={refreshKey} />
        </>
      )}

      {user?.role === "therapist" && (
        <p>Therapist dashboard coming soon — for now, this confirms your role-based rendering works.</p>
      )}
    </div>
  );
}