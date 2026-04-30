const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 CONEXIÓN MONGO (SRV)
mongoose.connect("mongodb+srv://appuser:MiPass1234@cluster0.qlsaznk.mongodb.net/tickets?retryWrites=true&w=majority")
  .then(() => console.log("🔥 Mongo conectado"))
  .catch(err => console.log("❌ Error Mongo:", err));

// 🔥 MODELO
const catalogoSchema = new mongoose.Schema({
  sku: String,
  articulo: String,
  ubicacion: String   // 🔥 NUEVO
});

const Catalogo = mongoose.model("Catalogo", catalogoSchema);
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
// 🔥 INVENTARIO
const inventarioSchema = new mongoose.Schema({
  sku: String,
  articulo: String,
  existencia: Number,
  ubicacion: String,
  fecha: { type: Date, default: Date.now }
});

const Inventario = mongoose.model("Inventario", inventarioSchema);

// 🔥 LOGIN SIMPLE

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).send("Usuario no encontrado");
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).send("Contraseña incorrecta");
    }

    res.json(user);

  } catch (err) {
    console.log(err);
    res.status(500).send("Error en login");
  }
});

// 🔥 USERS
// 🔥 OBTENER USUARIOS
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// 🔥 CREAR USUARIO
app.post("/users", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      role: "user",
      permisos: {
        dashboard: true,
        tickets: true,
        ciclicos: true,
        create: true,
        kanban: false,
        users: false	
      }
    });

    await user.save();

    res.json(user);

  } catch (err) {
    console.log(err);
    res.status(500).send("Error al crear usuario");
  }
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
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  await User.findByIdAndUpdate(req.params.id, {
    password: hashedPassword
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
  try {
    const { estado, user } = req.body;

    const dbUser = await User.findOne({ username: user });

    // 🔒 SOLO ADMIN PUEDE CAMBIAR ESTADO
    if (!dbUser || dbUser.role !== "admin") {
      return res.status(403).send("Solo admin puede cambiar estado");
    }

    await Ticket.findByIdAndUpdate(req.params.id, { estado });

    res.json({ ok: true });

  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
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
    const { start, end } = req.query;

let filtro = {};

if (start && end) {
  filtro.fecha = {
    $gte: new Date(start),
    $lte: new Date(end)
  };
}

const tickets = await Ticket.find(filtro);

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
// 🔥 SUBIR INVENTARIO
app.post("/inventario/upload", async (req, res) => {
  try {
    const raw = req.body.data;

    let inventario = {};

    raw.forEach(row => {
      const sku = String(row.sku || "").trim();
      const articulo = String(row.articulo || "").trim();
      const existencia = Number(String(row.existencia).replace(",", ".").trim());

      if (!sku || isNaN(existencia)) return;
      if (articulo.toUpperCase().includes("TOTAL")) return;

      if (!inventario[sku]) {
        inventario[sku] = {
          sku,
          articulo,
          existencia: 0
        };
      }

      inventario[sku].existencia += existencia;
    });

    const limpio = Object.values(inventario);

    await Inventario.deleteMany();
    await Inventario.insertMany(limpio);

    res.json({ ok: true, total: limpio.length });

  } catch (err) {
    console.log(err);
    res.status(500).send("Error limpieza");
  }
});
// 📥 SUBIR CATALOGO
app.post("/catalogo/upload", async (req, res) => {
  try {
    const raw = req.body.data;

    let catalogo = {};

    raw.forEach(row => {
      const sku = String(row.sku || "").trim();
      const articulo = String(row.articulo || "").trim();
      const ubicacion = String(row.ubicacion || "").trim();

      if (!sku) return;

      catalogo[sku] = {
        sku,
        articulo,
        ubicacion
      };
    });

    const limpio = Object.values(catalogo);

    await Catalogo.deleteMany();
    await Catalogo.insertMany(limpio);

    res.json({ ok: true, total: limpio.length });

  } catch (err) {
    console.log(err);
    res.status(500).send("Error catálogo");
  }
});

// 🔍 CONSULTAR INVENTARIO POR SKU (VA FUERA)
app.get("/inventario/:sku", async (req, res) => {
  try {
    const sku = String(req.params.sku).trim().toUpperCase();

    const item = await Inventario.findOne({
      sku: { $regex: `^${sku}$`, $options: "i" }
    });

    res.json(item);
  } catch (err) {
    res.status(500).send("Error");
  }
});

// 🔍 CONSULTAR CATALOGO
app.get("/catalogo/:sku", async (req, res) => {
  try {
    const sku = String(req.params.sku).trim().toUpperCase();

    const item = await Catalogo.findOne({
      sku: { $regex: `^${sku}$`, $options: "i" }
    });

    res.json(item);
  } catch {
    res.status(500).send("Error");
  }
});