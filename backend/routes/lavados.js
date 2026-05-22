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

/* =========================
   RUTAS
========================= */

router.post(
  "/",
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