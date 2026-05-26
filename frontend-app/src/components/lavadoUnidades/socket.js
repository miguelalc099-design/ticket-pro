import { io } from "socket.io-client";

const socket = io(
  "https://ticket-pro-backend.onrender.com"
);

export default socket;