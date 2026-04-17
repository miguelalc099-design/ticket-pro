const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 CONEXIÓN MONGO (SRV)
mongoose.connect("mongodb+srv://appuser:MiPass1234@cluster0.qlsaznk.mongodb.net/tickets?retryWrites=true&w=majority")
  .then(() => console.log("🔥 Mongo conectado"))
  .catch(err => console.log("❌ Error Mongo:", err));

// 🔥 MODELO
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
  permisos: Object
});

const User = mongoose.model("User", userSchema);

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

// 🔥 LOGIN SIMPLE

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username, password });

  if (!user) {
    return res.status(401).send("Credenciales incorrectas");
  }

  res.json(user);
});

// 🔥 USERS
// 🔥 OBTENER USUARIOS
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// 🔥 CREAR USUARIO
app.post("/users", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json(user);
});

// 🔥 ELIMINAR USUARIO
app.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error al eliminar usuario");
  }
});

// 🔥 ACTUALIZAR USUARIO (permisos, etc)
app.put("/users/:id", async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, req.body);
  res.json({ ok: true });
});

// 🔥 CAMBIAR PASSWORD
app.put("/users/:id/password", async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    password: req.body.password
  });
  res.json({ ok: true });
});


// 🔥 GET TICKETS
app.get("/tickets", async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ fecha: -1 });
    res.json(tickets);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error interno");
  }
});

// 🔥 CREAR TICKET
app.post("/tickets", async (req, res) => {
  try {
    const ticket = new Ticket(req.body);
    await ticket.save();
    res.json(ticket);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error interno");
  }
});

// 🔥 CAMBIAR ESTADO
app.put("/tickets/:id/estado", async (req, res) => {
  const { estado, user } = req.body;

  const dbUser = await User.findOne({ username: user });

  if (!dbUser || !dbUser.permisos?.tickets) {
    return res.status(403).send("Sin permiso");
  }

  await Ticket.findByIdAndUpdate(req.params.id, { estado });

  res.json({ ok: true });
});

// 🔥 COMENTARIO
app.post("/tickets/:id/comentario", async (req, res) => {
  try {
    const { usuario, texto } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) return res.status(404).send("No encontrado");

    ticket.comentarios.push({
      usuario,
      texto
    });

    await ticket.save();

    res.json(ticket);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error interno");
  }
});

// 🔥 STATS
app.get("/stats", async (req, res) => {
  try {
    const tickets = await Ticket.find();

    const porUsuario = {};
    const porPrioridad = {};
    const porMes = {};

    tickets.forEach(t => {
      // usuario
      porUsuario[t.usuario] = (porUsuario[t.usuario] || 0) + 1;

      // prioridad
      porPrioridad[t.prioridad] = (porPrioridad[t.prioridad] || 0) + 1;

      // mes
      const mes = new Date(t.fecha).toLocaleString("es-MX", { month: "short" });
      porMes[mes] = (porMes[mes] || 0) + 1;
    });

    res.json({
      porSemana: [],
      porUsuario: Object.entries(porUsuario).map(([usuario, total]) => ({ usuario, total })),
      porMes: Object.entries(porMes).map(([mes, total]) => ({ mes, total })),
      porPrioridad: Object.entries(porPrioridad).map(([prioridad, total]) => ({ prioridad, total }))
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});