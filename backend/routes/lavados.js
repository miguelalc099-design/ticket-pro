const express =
  require("express");

const auth =
  require("../middleware/auth");

const validarPermiso =
  require("../middleware/permisos");

const router =
  express.Router();


const {

  crearLavado,
  obtenerLavados,
  aprobarLavado,
rechazarLavado,
completarLavado

} = require(

  "../controllers/lavadosController"

);

const upload =
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
      maxCount: 4
    },

    {
      name: "fotosDespues",
      maxCount: 4
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

  auth,

  validarPermiso(
    "aprobarLavados"
  ),

  aprobarLavado
);

router.put(

  "/rechazar/:id",

  auth,

  validarPermiso(
    "aprobarLavados"
  ),

  rechazarLavado
);
router.put(

  "/completar/:id",

  upload.fields([

    {
      name: "fotosDespues",
      maxCount: 4
    }

  ]),

  completarLavado
);

module.exports =
  router;