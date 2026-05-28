const mongoose =
require("mongoose");

const lavadoSchema =
new mongoose.Schema({

folio: {
  type: String
},

fechaLavado: {
  type: Date
},

numeroUnidad: {
  type: String
},

tipoUnidad: {
  type: String
},

operadores: [{
  type: String
}],

cantidadOperadores: {
  type: Number
},

tiposLavado: [{
  type: String
}],

comentarios: {
  type: String
},

fotosAntes: [{
  type: String
}],

fotosDespues: [{
  type: String
}],

estatus: {

  type: String,

  default:
  "EN_PROCESO"
},

comentarioSupervisor: {
  type: String
},

firmaSupervisor: {
  type: String
},

creadoPor: {
  type: String,
  default: ""
}

aprobadoPor: {
  type: String
},

fechaAprobacion: {
  type: Date
},

bloqueado: {

  type: Boolean,

  default: false
}

}, {

timestamps: true

});

module.exports =
mongoose.model(
  "Lavado",
  lavadoSchema
);