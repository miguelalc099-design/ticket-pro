const express =
  require("express");

const router =
  express.Router();

const {

  crearLavado,
  obtenerLavados,
  aprobarLavado,
  rechazarLavado

} = require(

  "../controllers/lavadosController"

);

require(
  "../middleware/uploadLavados"
);

/* =========================
   RUTAS
========================= */

router.post(

  "/",

  upload.fields([

    {
      name: "fotosAntes",
      maxCount: 2
    },

    {
      name: "fotosDespues",
      maxCount: 2
    }

  ]),

  crearLavado
);

router.get(
  "/",
  obtenerLavados
);

router.put(
  "/aprobar/:id",
  aprobarLavado
);

router.put(
  "/rechazar/:id",
  rechazarLavado
);

module.exports =
  router;