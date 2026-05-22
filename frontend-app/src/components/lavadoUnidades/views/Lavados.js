const express =
require("express");

const router =
express.Router();

const Lavado =
require("../models/Lavado");

/* =========================
   GET
========================= */

router.get("/",

async (req, res) => {

try {

const lavados =
await Lavado.find()

.sort({

  createdAt: -1

});

res.json(lavados);

} catch (err) {

console.log(err);

res.status(500)
.json({

msg:
  "Error obteniendo lavados"

});

}

});

/* =========================
   POST
========================= */

router.post("/",

async (req, res) => {

try {

/* =========================
   FOLIO
========================= */

const total =
await Lavado.countDocuments();

const folio =

`LVD-${
  String(
    total + 1
  ).padStart(5,"0")
}`;

/* =========================
   CREATE
========================= */

const nuevoLavado =
new Lavado({

...req.body,

folio

});

await nuevoLavado.save();

res.json(nuevoLavado);

} catch (err) {

console.log(err);

res.status(500)
.json({

msg:
  "Error creando lavado"

});

}

});

/* =========================
   PUT
========================= */

router.put("/:id",

async (req, res) => {

try {

const lavado =
await Lavado.findById(
  req.params.id
);

if (!lavado) {

return res.status(404)
.json({

msg:
  "Lavado no encontrado"

});

}

/* =========================
   BLOQUEADO
========================= */

if (
lavado.bloqueado
) {

return res.status(400)
.json({

msg:
  "Lavado bloqueado"

});

}

/* =========================
   UPDATE
========================= */

const actualizado =
await Lavado.findByIdAndUpdate(

req.params.id,

{

...req.body,

bloqueado:

req.body.estatus ===
"APROBADA"

? true

: false,

fechaAprobacion:

req.body.estatus ===
"APROBADA"

? new Date()

: null

},

{ new: true }

);

res.json(actualizado);

} catch (err) {

console.log(err);

res.status(500)
.json({

msg:
  "Error actualizando lavado"

});

}

});

module.exports =
router;