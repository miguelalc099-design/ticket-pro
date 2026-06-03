const mongoose = require("mongoose");

const servicioLavadoSchema = new mongoose.Schema({

  nombre: {
    type: String,
    required: true,
    unique: true
  },

  precio: {
    type: Number,
    required: true,
    default: 0
  },

  activo: {
    type: Boolean,
    default: true
  }

}, {
  timestamps: true
});

module.exports = mongoose.model(
  "ServicioLavado",
  servicioLavadoSchema
);