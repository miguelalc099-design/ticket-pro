const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 CONEXIÓN MONGO (AGREGADO)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🔥 Mongo conectado"))
  .catch(err => console.log(err));

const FILE_TICKETS = path.join(__dirname, "tickets.json");
const FILE_USERS = path.join(__dirname, "users.json");

// ---------------- MODELOS (AGREGADO) ----------------
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
  permisos: Object
});
const User = mongoose.model("User", UserSchema);

const TicketSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  usuario: String,
  asignado: String,
  prioridad: String,
  estado: String,
  fecha: Number,
  comentarios: Array
});
const Ticket = mongoose.model("Ticket", TicketSchema);

// ---------------- HELPERS ----------------
const readJSON = (file, fallback) => {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
};

const saveJSON = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

// ---------------- DATA ----------------
let tickets = [];
let users = [];

// 🔥 CARGAR DESDE MONGO (REEMPLAZA JSON)
(async () => {
  tickets = await Ticket.find();
  users = await User.find();

  // crear admin si no existe
  if (!users.find(u => u.username === "admin")) {
    const admin = await User.create({
      username: "admin",
      password: "123",
      role: "admin",
      permisos: {
        dashboard: true,
        tickets: true,
        create: true,
        kanban: true,
        users: true
      }
    });
    users.push(admin);
  }
})();

// ---------------- LOGIN ----------------
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) return res.status(401).json({ message: "Login error" });

  res.json(user);
});

// ---------------- USERS ----------------
app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", async (req, res) => {
  const newUser = await User.create({
    username: req.body.username,
    password: req.body.password,
    role: "user",
    permisos: {
      dashboard: true,
      tickets: true,
      create: true,
      kanban: true,
      users: false
    }
  });

  users.push(newUser);
  res.json(newUser);
});

app.delete("/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  users = users.filter(u => u._id != req.params.id);

  res.json({ ok: true });
});

app.put("/users/:id/password", async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { password: req.body.password },
    { new: true }
  );

  const local = users.find(u => u._id == req.params.id);
  if (local) local.password = req.body.password;

  res.json(user);
});

app.put("/users/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  const local = users.find(u => u._id == req.params.id);
  if (local) Object.assign(local, req.body);

  res.json(user);
});

// ---------------- TICKETS ----------------

// GET
app.get("/tickets", (req, res) => {
  const { user, role } = req.query;

  if (role === "admin") return res.json(tickets);

  res.json(tickets.filter(t => t.usuario === user));
});

// CREATE
app.post("/tickets", async (req, res) => {
  const t = await Ticket.create({
    titulo: req.body.titulo,
    descripcion: req.body.descripcion,
    usuario: req.body.usuario,
    asignado: req.body.asignado || "Sin asignar",
    prioridad: req.body.prioridad || "Media",
    estado: "Abierto",
    fecha: Date.now(),
    comentarios: []
  });

  tickets.push(t);
  res.json(t);
});

// CAMBIAR ESTADO
app.put("/tickets/:id/estado", async (req, res) => {
  const t = await Ticket.findByIdAndUpdate(
    req.params.id,
    { estado: req.body.estado },
    { new: true }
  );

  const local = tickets.find(x => x._id == req.params.id);
  if (local) local.estado = req.body.estado;

  res.json(t);
});

// EDITAR TICKET
app.put("/tickets/:id", async (req, res) => {
  const t = await Ticket.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  const local = tickets.find(x => x._id == req.params.id);
  if (local) Object.assign(local, req.body);

  res.json(t);
});

// COMENTARIOS
app.post("/tickets/:id/comentario", async (req, res) => {
  const t = await Ticket.findById(req.params.id);

  t.comentarios.push({
    usuario: req.body.usuario,
    texto: req.body.texto,
    fecha: Date.now()
  });

  await t.save();

  const local = tickets.find(x => x._id == req.params.id);
  if (local) local.comentarios = t.comentarios;

  res.json(t);
});

// ---------------- STATS ----------------
app.get("/stats", (req, res) => {
  const { start, end } = req.query;

  let data = [...tickets];

  if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    data = data.filter(t => {
      const fecha = new Date(t.fecha);
      return fecha >= startDate && fecha <= endDate;
    });
  }

  const porUsuario = {};
  const porMes = {};
  const porSemana = {};
  const porPrioridad = {};

  data.forEach(t => {
    porUsuario[t.usuario] = (porUsuario[t.usuario] || 0) + 1;
    porPrioridad[t.prioridad] = (porPrioridad[t.prioridad] || 0) + 1;

    const fecha = new Date(t.fecha);

    const mes = fecha.toLocaleString("default", {
      month: "short",
      year: "numeric"
    });
    porMes[mes] = (porMes[mes] || 0) + 1;

    const firstDay = new Date(fecha);
    firstDay.setDate(fecha.getDate() - fecha.getDay());
    const weekLabel = firstDay.toLocaleDateString();

    porSemana[weekLabel] = (porSemana[weekLabel] || 0) + 1;
  });

  res.json({
    porUsuario: Object.entries(porUsuario).map(([usuario, total]) => ({ usuario, total })),
    porMes: Object.entries(porMes).map(([mes, total]) => ({ mes, total })),
    porSemana: Object.entries(porSemana).map(([semana, total]) => ({ semana, total })),
    porPrioridad: Object.entries(porPrioridad).map(([prioridad, total]) => ({ prioridad, total }))
  });
});

// ---------------- SERVER ----------------
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});