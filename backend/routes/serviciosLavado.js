const express = require("express");
const router = express.Router();

const ServicioLavado =
require("../models/ServicioLavado");

router.get("/", async (req, res) => {

  try {

    const servicios =
      await ServicioLavado.find({
        activo: true
      });

    res.json(servicios);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

router.post("/", async (req, res) => {

  try {

    const servicio =
      await ServicioLavado.create({
        nombre: req.body.nombre,
        precio: req.body.precio
      });

    res.json(servicio);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

router.put("/:id", async (req, res) => {

  try {

    const servicio =
      await ServicioLavado.findByIdAndUpdate(

        req.params.id,

        {
          nombre: req.body.nombre,
          precio: req.body.precio
        },

        {
          new: true
        }

      );

    res.json(servicio);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

router.delete("/:id", async (req, res) => {

  try {

    await ServicioLavado.findByIdAndUpdate(

      req.params.id,

      {
        activo: false
      }

    );

    res.json({
      ok: true
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

module.exports = router;