import { io } from "socket.io-client";

let socket = null;

// Creates (or reuses) a single socket connection, authenticated with the current token
export function getSocket() {
  if (!socket) {
    const token = localStorage.getItem("token");
    socket = io(process.env.REACT_APP_API_URL.replace("/api", ""), {
      auth: { token },
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}