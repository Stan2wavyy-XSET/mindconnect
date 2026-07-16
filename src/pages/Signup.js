import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await client.post("/auth/signup", { name, email, password, role });
      login(response.data.token, response.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "60px auto", padding: 24 }}>
      <h1>Create your account</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required style={{ width: "100%", padding: 8 }} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%", padding: 8 }} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%", padding: 8 }} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>I am a:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: "100%", padding: 8 }}>
            <option value="user">User seeking support</option>
            <option value="therapist">Therapist</option>
          </select>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading} style={{ width: "100%", padding: 10 }}>
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p style={{ marginTop: 16 }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}