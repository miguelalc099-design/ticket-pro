const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();

app.use(cors());

app.use(express.json({
  limit: "50mb"
}));

// 🔥 CONEXIÓN MONGO (SRV)
mongoose.connect("mongodb+srv://appuser:MiPass1234@cluster0.qlsaznk.mongodb.net/tickets?retryWrites=true&w=majority")
  .then(() => console.log("🔥 Mongo conectado"))
  .catch(err => console.log("❌ Error Mongo:", err));
const lavadosRoutes =
  require("./routes/lavados");

app.use(
  "/lavados",
  lavadosRoutes
);
// 🔥 MODELO

const catalogoSchema = new mongoose.Schema({

  sku: String,

  articulo: String,

  existencia: Number,

  ubicacion: String
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
  costo: Number,
  fecha: { type: Date, 
  default: Date.now 
}
});

const Inventario = mongoose.model("Inventario", inventarioSchema);

// 🔥 CICLICOS
const ciclicoSchema = new mongoose.Schema({

  folio: String,

  titulo: String,

  tipo: {
    type: String,
    default: "ciclico"
  },

  area: {
    type: String,
    default: "almacen"
  },

  fecha: String,

  estado: {
    type: String,
    default: "Abierto"
  },

  creadoPor: String,

  totalCapturados: {
    type: Number,
    default: 0
  },

  diferencias: {
    type: Number,
    default: 0
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Ciclico = mongoose.model("Ciclico", ciclicoSchema);

// 🔥 CAPTURAS

const capturaSchema = new mongoose.Schema({

  ciclicoId: String,

  sku: String,
  articulo: String,
  ubicacion: String,

  sistema: Number,
  conteo: Number,
  diferencia: Number,

  costo: Number,

  ajuste: Number,

  fecha: {
    type: Date,
    default: Date.now
  }
});

const CapturaCiclico = mongoose.model("CapturaCiclico", capturaSchema);

// 🔥 INVENTARIO IT

const monitorSchema =
  new mongoose.Schema({

  marca: {
    type: String,
    default: ""
  },

  modelo: {
    type: String,
    default: ""
  },

  serie: {
    type: String,
    default: ""
  },

  tipoMonitor: {
    type: String,

    enum: [
      "empresa",
      "prestado"
    ],

    default: "empresa"
  }

});

const equipoITSchema =
  new mongoose.Schema({

numeroSerie: {
  type: String,
  default: ""
},

marca: {
  type: String,
  default: ""
},

modelo: {
  type: String,
  default: ""
},

procesador: {
  type: String,
  default: ""
},

ram: {
  type: String,
  default: ""
},

tarjetaGrafica: {
  type: String,
  default: ""
},

almacenamiento: {
  type: String,
  default: ""
},

tipoSistema: {
  type: String,
  default: ""
},

idDispositivo: {
  type: String,
  default: ""
},

idProducto: {
  type: String,
  default: ""
},

nombreEquipo: {
  type: String,
  required: true
},

  usuarioAsignado: {
    type: String,
    required: true
  },

  tipoEquipo: {

    type: String,

    enum: [
      "laptop",
      "desktop"
    ],

    required: true
  },

  windows: {
    type: String,
    required: true
  },

  antivirus: {
    type: String,
    default: ""
  },

  estadoAntivirus: {

    type: String,

    enum: [
      "activo",
      "pendiente",
      "inactivo"
    ],

    default: "activo"
  },

  passwordWindows: {
    type: String,
    default: ""
  },

  passwordWindowsDesconocido: {
    type: Boolean,
    default: false
  },

  passwordERP: {
    type: String,
    default: ""
  },

  passwordERPNoAplica: {
    type: Boolean,
    default: false
  },

  fechaCambioPasswordWindows: {
    type: Date,
    default: null
  },

  fechaExpiracionPasswordWindows: {
    type: Date,
    default: null
  },

  fechaCambioPasswordERP: {
    type: Date,
    default: null
  },

  fechaExpiracionPasswordERP: {
    type: Date,
    default: null
  },

  fechaExpiracionAntivirus: {
    type: Date,
    default: null
  },

  diasAlertaAntivirus: {
    type: Number,
    default: 4
  },

  mfa: {
    type: Boolean,
    default: false
  },

  monitores: [
    monitorSchema
  ],

  observaciones: {
    type: String,
    default: ""
  },

  estadoSeguridad: {

    type: String,

    enum: [
      "seguro",
      "alerta",
      "riesgo"
    ],

    default: "seguro"
  },

  alertas: {
    type: [String],
    default: []
  },

  creadoPor: {
    type: String,
    default: ""
  }

}, {
  timestamps: true
});

const EquipoIT =
  mongoose.model(
    "EquipoIT",
    equipoITSchema
  );

/* =========================================
   AUDITORIAS IT
========================================= */

const auditoriaITSchema =
  new mongoose.Schema({

  equipoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EquipoIT"
  },

  nombreEquipo: {
    type: String,
    default: ""
  },

  usuarioAsignado: {
    type: String,
    default: ""
  },

  score: {
    type: Number,
    default: 0
  },

  estado: {
    type: String,
    default: "RIESGO"
  },

  passwordInicio: {
    type: Boolean,
    default: false
  },

  bloqueoAutomatico: {
    type: Boolean,
    default: false
  },

  mfaActivo: {
    type: Boolean,
    default: false
  },

  antivirusActivo: {
    type: Boolean,
    default: false
  },

  escritorioLimpio: {
    type: Boolean,
    default: false
  },

  usbNoAutorizado: {
    type: Boolean,
    default: false
  },

  serieCorrecta: {
    type: Boolean,
    default: false
  },

  observaciones: {
    type: String,
    default: ""
  },

  auditor: {
    type: String,
    default: ""
  },

  finalizada: {
    type: Boolean,
    default: true
  },

  fechaAuditoria: {
    type: Date,
    default: Date.now
  }

}, {
  timestamps: true
});

const AuditoriaIT =
  mongoose.model(
    "AuditoriaIT",
    auditoriaITSchema
  );
/* =========================================
   AUDITORIA GENERAL IT
========================================= */

const auditoriaGeneralSchema =
  new mongoose.Schema({

  nombreAuditoria: {
    type: String,
    default: ""
  },
tipoAuditoria: {
  type: String,
  default: ""
},
  auditor: {
    type: String,
    default: ""
  },

  estado: {
    type: String,
    default: "activa"
  },

  finalizada: {
    type: Boolean,
    default: false
  },

  fechaInicio: {
    type: Date,
    default: Date.now
  },

  fechaFinalizacion: {
    type: Date
  },

  equipos: [

    {

      equipoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EquipoIT"
      },

      nombreEquipo: {
        type: String,
        default: ""
      },

      usuarioAsignado: {
        type: String,
        default: ""
      },

      score: {
        type: Number,
        default: 0
      },

      estado: {
        type: String,
        default: "RIESGO"
      },

      passwordInicio: {
        type: Boolean,
        default: false
      },

      bloqueoAutomatico: {
        type: Boolean,
        default: false
      },

      mfaActivo: {
        type: Boolean,
        default: false
      },

      antivirusActivo: {
        type: Boolean,
        default: false
      },

      escritorioLimpio: {
        type: Boolean,
        default: false
      },

      usbNoAutorizado: {
        type: Boolean,
        default: false
      },

      serieCorrecta: {
        type: Boolean,
        default: false
      },

      observaciones: {
        type: String,
        default: ""
      }

    }

  ]

}, {
  timestamps: true
});

const AuditoriaITGeneral =
  mongoose.model(
    "AuditoriaITGeneral",
    auditoriaGeneralSchema
  );

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
  users: false,
  inventarioIT: false
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
console.log("RAW INVENTARIO:");
console.log(raw.slice(0, 5));

    let inventario = {};

    raw.forEach((row, index) => {

      // 🔥 SALTAR ENCABEZADO
      if (index === 0) return;

      // 🔥 COLUMNA C = ARTICULO
      const articulo = String(
        row[2] || ""
      ).trim();

      // 🔥 COLUMNA D = SKU
      let sku = String(
  row[3] || ""
)
.trim()
.toUpperCase();

// 🔥 SOLO NUMÉRICOS
if (/^\d+$/.test(sku)) {

  sku = sku.replace(/^0+/, "");
}

      // 🔥 COLUMNA F = EXISTENCIA
      const existencia = Number(
  String(row[5] || 0)
    .replace(/,/g, "")
    .trim()
);
// 🔥 G = COSTO
const costo = Number(

  String(row[6] || 0)

    .replace("$", "")

    .replace(/,/g, "")

    .trim()
);

      // 🔥 IGNORAR VACIOS
      if (!sku) return;

      // 🔥 IGNORAR TOTALES
      if (articulo.toUpperCase().includes("TOTAL")) return;

      // 🔥 SI NO EXISTE
      if (!inventario[sku]) {

inventario[sku] = {

  sku,

  articulo,

  existencia: 0,

  costo
};
      }

      // 🔥 SUMAR EXISTENCIA
      inventario[sku].existencia += existencia;

    });

    const limpio = Object.values(inventario);

    // 🔥 BORRAR ANTERIOR
    await Inventario.deleteMany();

    // 🔥 INSERTAR NUEVO
    await Inventario.insertMany(limpio);

res.json({
  ok: true,
  total: limpio.length
});
  } catch (err) {

    console.log(err);

    res.status(500).send("Error inventario");
  }
});


// 📥 SUBIR CATALOGO
app.post("/catalogo/upload", async (req, res) => {

  try {

    const raw = req.body.data;
console.log("RAW CATALOGO:");
console.log(raw.slice(0, 5));

    let catalogo = {};

raw.forEach((row, index) => {

  // 🔥 SALTAR ENCABEZADO
  if (index === 0) return;

  // 🔥 B = SKU
  const sku = String(
    row[1] || ""
  ).trim();

  // 🔥 C = ARTICULO
  const articulo = String(
    row[2] || ""
  ).trim();

  // 🔥 D = EXISTENCIA
  const existencia = Number(
    String(row[3] || 0)
      .replace(/,/g, "")
      .trim()
  );

  // 🔥 H = UBICACION
  const ubicacion = String(
    row[7] || ""
  ).trim();

  if (!sku) return;

  catalogo[sku] = {

    sku,

    articulo,

    existencia,

    ubicacion
  };

});

    const limpio = Object.values(catalogo);

    // 🔥 BORRAR ANTERIOR
    await Catalogo.deleteMany();

    // 🔥 INSERTAR NUEVO
    await Catalogo.insertMany(limpio);

res.json({
  ok: true
});
  } catch (err) {

    console.log(err);

    res.status(500).send("Error catálogo");
  }
});

// 🔍 CONSULTAR INVENTARIO POR SKU
app.get("/inventario/:sku", async (req, res) => {

  try {

    const sku = String(req.params.sku)
      .trim()
      .toUpperCase();

    console.log("BUSCANDO INVENTARIO:", sku);

    const item = await Inventario.findOne({
      sku: { $regex: `^${sku}$`, $options: "i" }
    });

    console.log("ITEM INVENTARIO:", item);

    res.json(item);

  } catch (err) {

    console.log(err);

    res.status(500).send("Error");
  }
});

// 🔍 CONSULTAR CATALOGO
app.get("/catalogo/:sku", async (req, res) => {

  try {

    const sku = String(req.params.sku)
      .trim()
      .toUpperCase();

    console.log("BUSCANDO CATALOGO:", sku);

    const item = await Catalogo.findOne({
      sku: { $regex: `^${sku}$`, $options: "i" }
    });

    console.log("ITEM CATALOGO:", item);

    res.json(item);

  } catch (err) {

    console.log(err);

    res.status(500).send("Error");
  }
});

// 🔍 BUSQUEDA INTELIGENTE
app.get("/buscar", async (req, res) => {

  try {

    const q = String(req.query.q || "")
      .trim()
      .toLowerCase();

    // 🔥 VACIO
    if (!q) {

      return res.json([]);
    }

// 🔥 PALABRAS IGNORADAS
const ignorar = [
  "de",
  "la",
  "el",
  "los",
  "las",
  "para",
  "p/",
  "con",
  "y"
];

// 🔥 SEPARAR Y LIMPIAR
const palabras = q
  .split(" ")
  .map(p => p.trim())
  .filter(p =>
    p.length > 1 &&
    !ignorar.includes(p)
  );
    // 🔥 TODAS LAS PALABRAS
    const filtros = palabras.map(p => ({

  $or: [

    {
      articulo: {
        $regex: p,
        $options: "i"
      }
    },

    {
      sku: {
        $regex: p,
        $options: "i"
      }
    }

  ]

}));

    // 🔥 BUSCAR EN CATALOGO
    const catalogo = await Catalogo.find({
      $and: filtros
    }).limit(20);

    // 🔥 AGREGAR EXISTENCIA
    const resultado = await Promise.all(

      catalogo.map(async item => {

        let skuBusqueda = String(item.sku)
  .trim()
  .toUpperCase();

// 🔥 SOLO NUMÉRICOS
if (/^\d+$/.test(skuBusqueda)) {

  skuBusqueda =
    skuBusqueda.replace(/^0+/, "");
}

const inv = await Inventario.findOne({
  sku: skuBusqueda
});

return {

  sku: item.sku,

  articulo: item.articulo,

  ubicacion: item.ubicacion,

  existencia:
    inv?.existencia || 0,

  costo:
    inv?.costo || 0
};

      })
    );

    res.json(resultado);

  } catch (err) {

    console.log(err);

    res.status(500).send("Error búsqueda");
  }
});

// 🔥 CREAR CICLICO
app.post("/ciclicos", async (req, res) => {
  try {

    const total = await Ciclico.countDocuments();

    const nuevo = new Ciclico({

  folio: `CIC-${String(total + 1).padStart(4, "0")}`,

  titulo: req.body.titulo,

  tipo: req.body.tipo,

  area: req.body.area,

  fecha: req.body.fecha,

  creadoPor: req.body.creadoPor
});

    await nuevo.save();

    res.json(nuevo);

  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});
app.get("/ciclicos", async (req, res) => {
  try {

    const data = await Ciclico.find()
      .sort({ createdAt: -1 });

    res.json(data);

  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});
app.post("/ciclicos/:id/captura", async (req, res) => {
  try {
const ciclico = await Ciclico.findById(
  req.params.id
);

if (ciclico.estado === "Cerrado") {

  return res
    .status(400)
    .send("Cíclico cerrado");
}
    
const existente =
  await CapturaCiclico.findOne({

    ciclicoId: req.params.id,

    sku: req.body.sku
  });
if (existente) {

  return res.status(409).json({

    duplicado: true,

    captura: existente
  });
}


    const nueva = new CapturaCiclico({
      ciclicoId: req.params.id,

      sku: req.body.sku,
      articulo: req.body.articulo,
      ubicacion: req.body.ubicacion,

      sistema: req.body.sistema,
      conteo: req.body.conteo,

diferencia: req.body.diferencia,

costo: req.body.costo,

ajuste: req.body.ajuste
    });

    await nueva.save();

    const totalCapturados = await CapturaCiclico.countDocuments({
      ciclicoId: req.params.id
    });

    const diferencias = await CapturaCiclico.countDocuments({
      ciclicoId: req.params.id,
      diferencia: { $ne: 0 }
    });

    await Ciclico.findByIdAndUpdate(req.params.id, {
      totalCapturados,
      diferencias
    });

    res.json(nueva);

  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});
app.get("/ciclicos/:id/capturas", async (req, res) => {
  try {

    const data = await CapturaCiclico.find({
      ciclicoId: req.params.id
    });

    res.json(data);

  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});
// 🔥 EDITAR CAPTURA
app.put("/capturas/:id", async (req, res) => {

  try {

    const { conteo } = req.body;

    const captura =
      await CapturaCiclico.findById(
        req.params.id
      );

    if (!captura) {
      return res
        .status(404)
        .send("No encontrada");
    }
const ciclico =
  await Ciclico.findById(
    captura.ciclicoId
  );

if (ciclico.estado === "Cerrado") {

  return res
    .status(400)
    .send("Cíclico cerrado");
}
    captura.conteo =
      Number(conteo);

    captura.diferencia =

      Number(conteo) -

      Number(captura.sistema || 0);

    captura.ajuste =

      captura.diferencia *

      Number(captura.costo || 0);

    await captura.save();

    // 🔥 ESTO ES LO IMPORTANTE
    const actualizada =
      await CapturaCiclico.findById(
        req.params.id
      );

    res.json(actualizada);

  } catch (err) {

    console.log(err);

    res.status(500)
      .send("Error editando");
  }
});
// 🔥 ELIMINAR CAPTURA
app.delete("/capturas/:id", async (req, res) => {

  try {

    const captura =
      await CapturaCiclico.findById(
        req.params.id
      );

    if (!captura) {
      return res.status(404).send("No existe");
    }
const ciclico =
  await Ciclico.findById(
    captura.ciclicoId
  );

if (ciclico.estado === "Cerrado") {

  return res
    .status(400)
    .send("Cíclico cerrado");
}

    const ciclicoId =
      captura.ciclicoId;

    await CapturaCiclico.findByIdAndDelete(
      req.params.id
    );

    // 🔥 RECALCULAR KPIs
    const totalCapturados =
      await CapturaCiclico.countDocuments({
        ciclicoId
      });

    const diferencias =
      await CapturaCiclico.countDocuments({
        ciclicoId,
        diferencia: { $ne: 0 }
      });

    await Ciclico.findByIdAndUpdate(
      ciclicoId,
      {
        totalCapturados,
        diferencias
      }
    );

    res.json({
      ok: true
    });

  } catch (err) {

    console.log(err);

    res.status(500).send("Error eliminando");
  }
});
// 🔥 EXPORTAR EXCEL CICLICO
app.get("/ciclicos/:id/excel", async (req, res) => {

  try {

    const capturas = await CapturaCiclico.find({
      ciclicoId: req.params.id
    });

    res.json(capturas);

  } catch (err) {

    console.log(err);

    res.status(500).send("Error exportando");
  }

});
app.put("/ciclicos/:id/cerrar", async (req, res) => {
  try {

    await Ciclico.findByIdAndUpdate(req.params.id, {
      estado: "Cerrado"
    });

    res.json({ ok: true });

  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});
/* =========================================
   MOTOR SEGURIDAD IT
========================================= */

function diasRestantes(fecha) {

  if (!fecha) return null;

  const hoy =
    new Date();

  const vencimiento =
    new Date(fecha);

  hoy.setHours(0,0,0,0);

  vencimiento.setHours(0,0,0,0);

  const diff =
    vencimiento - hoy;

  return Math.ceil(
    diff / (1000 * 60 * 60 * 24)
  );
}

function calcularEstadoSeguridad(
  equipo
) {

  let estado =
    "seguro";

  let alertas = [];

  /* =========================
     MFA
  ========================= */

  if (!equipo.mfa) {

    estado = "riesgo";

    alertas.push(
      "MFA desactivado"
    );
  }

  /* =========================
     PASSWORD WINDOWS
  ========================= */

  if (
    !equipo.passwordWindowsDesconocido &&
    equipo.fechaExpiracionPasswordWindows
  ) {

    const dias =
      diasRestantes(
        equipo.fechaExpiracionPasswordWindows
      );

    if (dias < 0) {

      estado = "riesgo";

      alertas.push(
        "Password Windows vencido"
      );

    } else if (dias <= 4) {

      if (estado !== "riesgo") {
        estado = "alerta";
      }

      alertas.push(
        `Password Windows vence en ${dias} días`
      );
    }
  }
/* =========================
   PASSWORD WINDOWS DESCONOCIDO
========================= */

if (equipo.passwordWindowsDesconocido) {


  estado = "riesgo";

  alertas.push(
    "Password Windows desconocido"
  );
}
if (
  !equipo.passwordERPNoAplica &&
  !equipo.passwordERP
) {

  estado = "riesgo";

  alertas.push(
    "Password ERP no configurado"
  );
}
/* =========================
   PASSWORD WINDOWS VACIO
========================= */

if (
  !equipo.passwordWindowsDesconocido &&
  !equipo.passwordWindows
) {

  estado = "riesgo";

  alertas.push(
    "Equipo sin password Windows"
  );
}
  /* =========================
     PASSWORD ERP
  ========================= */

  if (
    !equipo.passwordERPNoAplica &&
    equipo.fechaExpiracionPasswordERP
  ) {

    const dias =
      diasRestantes(
        equipo.fechaExpiracionPasswordERP
      );

    if (dias < 0) {

      estado = "riesgo";

      alertas.push(
        "Password ERP vencido"
      );

    } else if (dias <= 4) {

      if (estado !== "riesgo") {
        estado = "alerta";
      }

      alertas.push(
        `Password ERP vence en ${dias} días`
      );
    }
  }
/* =========================
   ANTIVIRUS NO CONFIGURADO
========================= */

if (!equipo.antivirus) {

  estado = "riesgo";

  alertas.push(
    "Equipo sin antivirus"
  );
}
  /* =========================
     ANTIVIRUS
  ========================= */

  if (
    equipo.antivirus &&
    equipo.antivirus !== "Microsoft Defender" &&
    equipo.fechaExpiracionAntivirus
  ) {

    const dias =
      diasRestantes(
        equipo.fechaExpiracionAntivirus
      );

    if (dias < 0) {

      estado = "riesgo";

      alertas.push(
        "Antivirus vencido"
      );

    } else if (dias <= 4) {

      if (estado !== "riesgo") {
        estado = "alerta";
      }

      alertas.push(
        `Antivirus vence en ${dias} días`
      );
    }
  }

  return {
    estadoSeguridad: estado,
    alertas
  };
}
// 🔥 OBTENER EQUIPOS IT

app.get("/it/equipos", async (req, res) => {

  try {

    const equipos =
      await EquipoIT.find()
      .sort({ createdAt: -1 });

    res.json(equipos);

  } catch (err) {

    console.log(err);

    res.status(500)
      .send("Error obteniendo equipos");
  }
});

// 🔥 CREAR EQUIPO IT

app.post("/it/equipos", async (req, res) => {

  try {

    const seguridad =
      calcularEstadoSeguridad(
        req.body
      );

    const nuevo =
      new EquipoIT({

        ...req.body,

        estadoSeguridad:
          seguridad.estadoSeguridad,

        alertas:
          seguridad.alertas

      });

    await nuevo.save();

    res.json(nuevo);

  } catch (err) {

    console.log(err);

    res.status(500)
      .send("Error creando equipo");
  }
});

// 🔥 EDITAR EQUIPO IT

app.put("/it/equipos/:id", async (req, res) => {

  try {

    /* =========================
       OBTENER EQUIPO ACTUAL
    ========================= */

    const equipoActual =

      await EquipoIT.findById(
        req.params.id
      );

    if (!equipoActual) {

      return res
        .status(404)
        .send("Equipo no encontrado");
    }

    /* =========================
       MEZCLAR DATOS
    ========================= */

    const datosActualizados = {

      ...equipoActual.toObject(),

      ...req.body
    };

    /* =========================
       RECALCULAR SEGURIDAD
    ========================= */

    const seguridad =

      calcularEstadoSeguridad(
        datosActualizados
      );

    /* =========================
       GUARDAR
    ========================= */

    await EquipoIT.findByIdAndUpdate(

      req.params.id,

      {

        ...datosActualizados,

        estadoSeguridad:
          seguridad.estadoSeguridad,

        alertas:
          seguridad.alertas
      }

    );

    res.json({
      ok: true
    });

  } catch (err) {

    console.log(err);

    res.status(500)
      .send("Error actualizando equipo");
  }
});

// 🔥 ELIMINAR EQUIPO IT

app.delete("/it/equipos/:id", async (req, res) => {

  try {

    await EquipoIT.findByIdAndDelete(
      req.params.id
    );

    res.json({
      ok: true
    });

  } catch (err) {

    console.log(err);

    res.status(500)
      .send("Error eliminando equipo");
  }
});

/* =========================================
   AUDITORIAS IT
========================================= */


/* =========================================
   GUARDAR AUDITORIA GENERAL
========================================= */

app.post(
  "/it/auditorias-generales",

  async (req, res) => {

  try {

    const nuevaAuditoria =

      new AuditoriaITGeneral(
        req.body
      );

    await nuevaAuditoria.save();

    res.json(nuevaAuditoria);

  } catch (err) {

    console.log(err);

    res.status(500)
      .send(
        "Error guardando auditoría general"
      );
  }
});

/* =========================================
   OBTENER AUDITORIAS GENERALES
========================================= */

app.get(
  "/it/auditorias-generales",

  async (req, res) => {

  try {

    const auditorias =

      await AuditoriaITGeneral
      .find()
      .sort({
        createdAt: -1
      });

    res.json(auditorias);

  } catch (err) {

    console.log(err);

    res.status(500)
      .send(
        "Error obteniendo auditorías"
      );
  }
});

/* =========================================
   SERVER
========================================= */

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Servidor iniciado " + PORT);
});