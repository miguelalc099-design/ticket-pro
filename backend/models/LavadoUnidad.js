const mongoose =
  require("mongoose");

const lavadoSchema =
  new mongoose.Schema({

  folio: {
    type: String,
    required: true
  },

  fechaLavado: {
    type: Date,
    required: true
  },

  operador: {
    type: String,
    required: true
  },

  supervisor: {
    type: String,
    required: true
  },

  tipoUnidad: {
    type: String,
    enum: [
      "Remolque",
      "Tracto"
    ],
    required: true
  },

  numeroUnidad: {
    type: String,
    required: true
  },

  tipoLavado: {
    type: String,
    enum: [
      "Lavada",
      "Detallado",
      "Barrida",
      "Fumigada",
      "Pulida",
      "Limpieza interior"
    ],
    required: true
  },

  comentarios: {
    type: String,
    default: ""
  },

  fotosAntes: {
    type: [String],
    default: []
  },

  fotosDespues: {
    type: [String],
    default: []
  },

  firmaSupervisor: {
    type: String,
    default: ""
  },

  comentarioRechazo: {
    type: String,
    default: ""
  },

  estatus: {
    type: String,
    enum: [
      "BORRADOR",
      "EN_ESPERA",
      "APROBADA",
      "RECHAZADA"
    ],
    default: "BORRADOR"
  },

  fechaEnvio: {
    type: Date
  },

  fechaAprobacion: {
    type: Date
  },

  creadoPor: {
    type: String,
    default: ""
  }

}, {
  timestamps: true
});

module.exports =
  mongoose.model(
    "LavadoUnidad",
    lavadoSchema
  );