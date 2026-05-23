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

    const nuevoLavado =
      new Lavado({

      ...req.body,

      folio,

      estatus:
        "EN_ESPERA",

      fechaEnvio:
        new Date()

    });

    await nuevoLavado.save();

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

          fechaAprobacion:
            new Date()
        },

        {
          new: true
        }
      );

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

          comentarioRechazo:
            req.body.comentarioRechazo

        },

        {
          new: true
        }
      );

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
  rechazarLavado

};