const Lavado =
  require("../models/Lavado");

/* =========================
   CREAR LAVADO
========================= */

const crearLavado =
async (req, res) => {

  try {

    const total =
      await Lavado.countDocuments();

    const folio =
      `LW-2026-${
        String(total + 1)
        .padStart(6, "0")
      }`;

 const fotosAntes =

  req.files?.fotosAntes

  ? req.files.fotosAntes.map(
      (file) => file.path
    )

  : [];

const fotosDespues =

  req.files?.fotosDespues

  ? req.files.fotosDespues.map(
      (file) => file.path
    )

  : [];

/* =========================
   NUEVO LAVADO
========================= */

const nuevoLavado =
  new Lavado({

    ...req.body,

    folio,

    fotosAntes,

    fotosDespues,

    estatus:
      req.body.estatus ||
      "EN_PROCESO",

    fechaEnvio:
      new Date()

});

    await nuevoLavado.save();

const io = req.app.get("io");

io.emit("lavado_actualizado");

    res.status(201).json({
      ok: true,
      lavado: nuevoLavado
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      ok: false,
      msg: "Error creando lavado"
    });
  }
};

/* =========================
   OBTENER LAVADOS
========================= */

const obtenerLavados =
async (req, res) => {

  try {

    const lavados =
      await Lavado
      .find()
      .sort({
        createdAt: -1
      });

    res.json(lavados);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      ok: false
    });
  }
};

/* =========================
   APROBAR
========================= */

const aprobarLavado =
async (req, res) => {

  try {

    const lavado =
      await Lavado
      .findByIdAndUpdate(

        req.params.id,

        {
  estatus:
    "APROBADA",

  firmaSupervisor:
    req.body.firmaSupervisor,

  comentarioSupervisor:
    req.body.comentarioSupervisor,

  aprobadoPor:
    req.body.aprobadoPor,

  fechaAprobacion:
    new Date()
},

        {
          new: true
        }
      );
const io = req.app.get("io");

io.emit("lavado_actualizado");
    res.json(lavado);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      ok: false
    });
  }
};

/* =========================
   RECHAZAR
========================= */

const rechazarLavado =
async (req, res) => {

  try {

    const lavado =
      await Lavado
      .findByIdAndUpdate(

        req.params.id,

       {
  estatus:
    "RECHAZADA",

  comentarioSupervisor:
    req.body.comentarioSupervisor,

  aprobadoPor:
    req.body.aprobadoPor,

  fechaAprobacion:
    new Date()
},

        {
          new: true
        }
      );
const io = req.app.get("io");

io.emit("lavado_actualizado");
    res.json(lavado);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      ok: false
    });
  }
};

/* =========================
   COMPLETAR LAVADO
========================= */

const completarLavado =
async (req, res) => {

  try {

const fotosDespues =

  req.files?.fotosDespues

  ? req.files.fotosDespues.map(
      (file) => file.path
    )

  : [];

const lavado =
  await Lavado.findByIdAndUpdate(

    req.params.id,

    {

      comentarios:
        req.body.comentarios,

      fotosDespues,

      estatus:
        "EN_ESPERA"

    },

    {
      new: true
    }

  );
const io = req.app.get("io");

io.emit("lavado_actualizado");
    res.json(lavado);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      ok: false
    });
  }
};
module.exports = {

  crearLavado,
  obtenerLavados,
  aprobarLavado,
  rechazarLavado,
  completarLavado

};