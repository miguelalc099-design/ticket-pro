const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 CONEXIÓN MONGO
mongoose.connect("TU_URI_DE_MONGO_AQUI")
  .then(() => console.log("🔥 Mongo conectado"))
  .catch(err => console.log(err));

// 🔥 MODELO
const ticketSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  usuario: String,
  prioridad: String,
  asignado: String,
  estado: { type: String, default: "Abierto" },
  fecha: { type: Date, default: Date.now },
  comentarios: [
    {
      usuario: String,
      texto: String,
      fecha: { type: Date, default: Date.now }
    }
  ]
});

const Ticket = mongoose.model("Ticket", ticketSchema);

// 🔥 LOGIN FALSO (simple)
app.post("/login", (req, res) => {
  res.json({
    username: req.body.username,
    role: "admin",
    permisos: {
      dashboard: true,
      tickets: true,
      create: true,
      kanban: true,
      users: true
    }
  });
});

// 🔥 USERS (dummy)
app.get("/users", (req, res) => {
  res.json([{ _id: "1", username: "admin" }]);
});

// 🔥 GET TICKETS
app.get("/tickets", async (req, res) => {
  const tickets = await Ticket.find().sort({ fecha: -1 });
  res.json(tickets);
});

// 🔥 CREAR TICKET
app.post("/tickets", async (req, res) => {
  const ticket = new Ticket(req.body);
  await ticket.save();
  res.json(ticket);
});

// 🔥 CAMBIAR ESTADO
app.put("/tickets/:id/estado", async (req, res) => {
  const { estado } = req.body;

  await Ticket.findByIdAndUpdate(req.params.id, { estado });

  res.json({ ok: true });
});

// 🔥 COMENTARIO
app.post("/tickets/:id/comentario", async (req, res) => {
  const { usuario, texto } = req.body;

  const ticket = await Ticket.findById(req.params.id);

  ticket.comentarios.push({
    usuario,
    texto
  });

  await ticket.save();

  res.json(ticket);
});

// 🔥 STATS
app.get("/stats", async (req, res) => {
  const tickets = await Ticket.find();

  const porSemana = [];
  const porUsuario = [];
  const porMes = [];
  const porPrioridad = [];

  res.json({
    porSemana,
    porUsuario,
    porMes,
    porPrioridad
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("🚀 Server running on port " + PORT));