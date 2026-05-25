import {
  useEffect,
  useState
} from "react";

import "./styles/lavados.css";

import NuevoLavado
from "./views/NuevoLavado";

import AprobacionesLavado
from "./views/AprobacionesLavado";

import CardLavado
from "./components/CardLavado";

import jsPDF
from "jspdf";

import autoTable
from "jspdf-autotable";

function LavadoUnidades() {

/* =========================
   STATES
========================= */

const [
  vista,
  setVista
] = useState("listado");

const [
  lavados,
  setLavados
] = useState([]);

const [
  loading,
  setLoading
] = useState(true);

const [
  paginaActual,
  setPaginaActual
] = useState(1);

const [
  filtro,
  setFiltro
] = useState("TODOS");

const [

  lavadoDetalle,
  setLavadoDetalle

] = useState(null);

const [

  imagenActiva,
  setImagenActiva

] = useState(null);

const usuario = JSON.parse(
  localStorage.getItem("user")
);

const lavadosPorPagina = 10;

/* =========================
   API
========================= */

const API =
"https://ticket-pro-backend.onrender.com";

/* =========================
   CARGAR
========================= */

const cargarLavados =
async () => {

  try {

    setLoading(true);

    const res =
      await fetch(
        `${API}/lavados`
      );

    const data =
      await res.json();

    setLavados(data);

  } catch (err) {

    console.log(err);

  } finally {

    setLoading(false);
  }
};

useEffect(() => {

  cargarLavados();

}, []);

/* =========================
   FILTROS
========================= */

const lavadosFiltrados =
  lavados.filter((lavado) => {

    if (
      filtro === "TODOS"
    ) return true;

    return (
      lavado.estatus === filtro
    );

  });

/* =========================
   PAGINACION
========================= */

const indiceFinal =
  paginaActual *
  lavadosPorPagina;

const indiceInicio =
  indiceFinal -
  lavadosPorPagina;

const lavadosPaginados =
  lavadosFiltrados.slice(
    indiceInicio,
    indiceFinal
  );

const totalPaginas =
  Math.ceil(
    lavadosFiltrados.length /
    lavadosPorPagina
  );

/* =========================
   NUEVO LAVADO
========================= */

if (
  vista === "nuevo"
) {

  return (

<NuevoLavado

  onClose={() => {

    setVista("listado");

    cargarLavados();

  }}

/>

  );
}

/* =========================
   APROBACIONES
========================= */

if (
  vista === "aprobaciones"
) {

  return (

<AprobacionesLavado

  onClose={() => {

    setVista("listado");

    cargarLavados();

  }}

/>

  );
}

/* =========================
   PDF
========================= */

const descargarPDF =
(lavado) => {

const doc =
  new jsPDF();

/* =========================
   HEADER
========================= */

doc.setFontSize(22);

doc.text(
  "AUDITORIA LAVADO",
  20,
  25
);

doc.setFontSize(12);

doc.text(
  `Folio: ${lavado.folio || "N/D"}`,
  20,
  45
);

doc.text(
  `Unidad: ${lavado.numeroUnidad}`,
  20,
  55
);

doc.text(
  `Tipo Unidad: ${lavado.tipoUnidad}`,
  20,
  65
);

doc.text(
  `Operadores: ${
    lavado.operadores?.join(", ")
  }`,
  20,
  75
);

doc.text(
  `Tipos Lavado: ${
    lavado.tiposLavado?.join(", ")
  }`,
  20,
  85
);

doc.text(
  `Estatus: ${lavado.estatus}`,
  20,
  95
);

doc.text(
  `Fecha: ${
    new Date(
      lavado.fechaLavado
    ).toLocaleDateString()
  }`,
  20,
  105
);

/* =========================
   TABLA
========================= */

autoTable(doc, {

  startY: 120,

  head: [[
    "Campo",
    "Valor"
  ]],

  body: [

    [
      "Supervisor",
      lavado.aprobadoPor || "N/D"
    ],

    [
      "Comentario",
      lavado.comentarioSupervisor || "N/D"
    ],

    [
      "Fecha Aprobacion",

      lavado.fechaAprobacion

      ? new Date(
          lavado.fechaAprobacion
        ).toLocaleString()

      : "N/D"
    ]

  ]

});

/* =========================
   FIRMA
========================= */

if (
  lavado.firmaSupervisor
) {

doc.text(
  "Firma Supervisor",
  20,
  doc.lastAutoTable.finalY + 20
);

doc.addImage(

  lavado.firmaSupervisor,

  "PNG",

  20,

  doc.lastAutoTable.finalY + 30,

  80,

  40

);

}

/* =========================
   SAVE
========================= */

doc.save(

`Lavado_${lavado.folio}.pdf`

);

};

/* =========================
   JSX
========================= */

return (

<div className="lavados-container">

{/* HEADER */}

<div className="lavados-header">

<div>

<h1 className="lavados-title">
  🚛 Lavado de Unidades
</h1>

<p className="lavados-subtitle">

  Gestión corporativa de
  lavados y aprobaciones.

</p>

</div>

<div
  style={{
    display: "flex",
    gap: "12px",
    flexWrap: "wrap"
  }}
>

<button
  className="btn-lavado"

  onClick={() =>
    setVista("nuevo")
  }
>
  ➕ Nuevo Lavado
</button>

{
usuario?.permisos
  ?.aprobarLavados && (

<button
  className="btn-lavado secondary"

  onClick={() =>
    setVista(
      "aprobaciones"
    )
  }
>
  ✅ Aprobaciones
</button>

)
}

</div>

</div>

{/* ================= KPIS PREMIUM ================= */}

<div className="kpis-grid">

<div className="kpi-card">

<div className="kpi-icon blue">
🚛
</div>

<div className="kpi-info">

<span className="kpi-label">
Total
</span>

<span className="kpi-number">
{lavados.length}
</span>

</div>

</div>

<div className="kpi-card">

<div className="kpi-icon yellow">
🟡
</div>

<div className="kpi-info">

<span className="kpi-label">
Pendientes
</span>

<span className="kpi-number">

{
lavados.filter(
(l) =>
l.estatus ===
"EN_ESPERA"
).length
}

</span>

</div>

</div>

<div className="kpi-card">

<div className="kpi-icon green">
🟢
</div>

<div className="kpi-info">

<span className="kpi-label">
Aprobadas
</span>

<span className="kpi-number">

{
lavados.filter(
(l) =>
l.estatus ===
"APROBADA"
).length
}

</span>

</div>

</div>

<div className="kpi-card">

<div className="kpi-icon red">
🔴
</div>

<div className="kpi-info">

<span className="kpi-label">
Rechazadas
</span>

<span className="kpi-number">

{
lavados.filter(
(l) =>
l.estatus ===
"RECHAZADA"
).length
}

</span>

</div>

</div>

</div>

{/* FILTROS */}

<div
  className="lavado-card"

  style={{
    marginBottom: "24px"
  }}
>

<div
  style={{
    display: "flex",
    gap: "12px",
    flexWrap: "wrap"
  }}
>

{
[
  "TODOS",
  "EN_ESPERA",
  "APROBADA",
  "RECHAZADA"
].map((estado) => (

<button

  key={estado}

  className={`chip-lavado ${
    filtro === estado
      ? "active"
      : ""
  }`}

  onClick={() => {

    setFiltro(
      estado
    );

    setPaginaActual(1);

  }}
>
  {estado}
</button>

))
}

</div>

</div>

{/* LOADING */}

{
loading && (

<div className="lavado-card">
  Cargando lavados...
</div>

)
}

{/* LISTADO */}

<div
  style={{
    display: "grid",
    gap: "18px"
  }}
>

{
!loading &&
lavadosPaginados.map(
(lavado) => (

<CardLavado

  key={lavado._id}

  lavado={lavado}

  onClick={() =>
    setLavadoDetalle(
      lavado
    )
  }

/>

))
}

</div>

{/* VACIO */}

{
!loading &&
lavadosPaginados.length === 0 && (

<div className="lavado-card">

  No existen registros.

</div>

)
}

{
lavadoDetalle && (

<div className="lavado-modal-overlay">

<div className="lavado-modal">

<button

  className="modal-close"

  onClick={() =>
    setLavadoDetalle(null)
  }
>
  ✕
</button>

{/* HEADER */}

<div className="modal-header">

<div>

<div className="modal-unidad">

🚛 {
  lavadoDetalle.numeroUnidad
}

</div>

<div className="modal-folio">

{
  lavadoDetalle.folio
}

</div>

</div>

<div
  className={`
    status
    ${
      lavadoDetalle.estatus ===
      "APROBADA"

      ? "status-aprobada"

      : lavadoDetalle.estatus ===
        "RECHAZADA"

      ? "status-rechazada"

      : "status-pendiente"
    }
  `}
>
  {lavadoDetalle.estatus}
</div>

</div>

{/* INFO */}

<div className="modal-info-grid">

<div className="modal-info-card">

<div className="modal-label">
👤 Operadores
</div>

<div className="modal-value">

{
lavadoDetalle.operadores?.join(", ")
}

</div>

</div>

<div className="modal-info-card">

<div className="modal-label">
🧼 Servicios
</div>

<div className="modal-value">

{
lavadoDetalle.tiposLavado?.join(", ")
}

</div>

</div>

<div className="modal-info-card">

<div className="modal-label">
📅 Fecha
</div>

<div className="modal-value">

{
new Date(
lavadoDetalle.fechaLavado
).toLocaleDateString()
}

</div>

</div>

<div className="modal-info-card">

<div className="modal-label">
👥 Operadores
</div>

<div className="modal-value">

{
lavadoDetalle.cantidadOperadores
}

</div>

</div>

</div>

{/* COMENTARIOS */}

{
lavadoDetalle.comentarios && (

<div className="modal-comments">

<div className="modal-label">
📝 Comentarios
</div>

<div className="modal-comment-text">

{
lavadoDetalle.comentarios
}

</div>

</div>

)
}
{
lavadoDetalle.estatus ===
"APROBADA" && (

<div className="audit-section">

<div className="audit-title">

🛡 Auditoría Supervisor

</div>

<div className="audit-grid">

<div className="audit-card">

<div className="modal-label">
👤 Aprobado por
</div>

<div className="modal-value">

{
lavadoDetalle.aprobadoPor
}

</div>

</div>

<div className="audit-card">

<div className="modal-label">
📅 Fecha aprobación
</div>

<div className="modal-value">

{
lavadoDetalle.fechaAprobacion

? new Date(
    lavadoDetalle.fechaAprobacion
  ).toLocaleString()

: "N/D"
}

</div>

</div>

</div>

{
lavadoDetalle.comentarioSupervisor && (

<div className="audit-comment">

<div className="modal-label">
📝 Comentario Supervisor
</div>

<div className="modal-comment-text">

{
lavadoDetalle.comentarioSupervisor
}

</div>

</div>

)
}

{
lavadoDetalle.firmaSupervisor && (

<div className="audit-signature">

<div className="modal-label">
✍ Firma Supervisor
</div>

<img

  src={
    lavadoDetalle.firmaSupervisor
  }

  alt="firma"

  className="firma-preview"

/>

</div>

)
}

</div>

)
}

{
lavadoDetalle.estatus ===
"APROBADA" && (

<button

className="btn-lavado secondary"

onClick={() =>
  descargarPDF(
    lavadoDetalle
  )
}

style={{
  marginBottom: "20px"
}}

>

📄 Descargar PDF

</button>

)
}

{/* GALERIA */}

<div className="modal-gallery-section">

<div className="modal-gallery-title">

📸 Evidencia Fotográfica

</div>

<div className="modal-gallery">

{
[
...(lavadoDetalle.fotosAntes || []),
...(lavadoDetalle.fotosDespues || [])
].map((foto, index) => (

<img

  key={index}

  src={foto}

  alt="lavado"

  className="modal-gallery-image"

  onClick={() =>
    setImagenActiva(
      foto
    )
  }

/>
))
}

</div>

</div>

</div>

</div>

)
}
{
imagenActiva && (

<div className="lightbox-overlay">

<button

  className="lightbox-close"

  onClick={() =>
    setImagenActiva(null)
  }
>
  ✕

</button>

<img

  src={imagenActiva}

  alt="fullscreen"

  className="lightbox-image"

/>

</div>

)
}

{/* PAGINACION */}

{
totalPaginas > 1 && (

<div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginTop: "28px"
  }}
>

<button
  className="btn-lavado secondary"

  disabled={
    paginaActual === 1
  }

  onClick={() =>
    setPaginaActual(
      paginaActual - 1
    )
  }
>
  ⬅
</button>

<div
  className="lavado-card"
>
  Página {
    paginaActual
  } de {
    totalPaginas
  }
</div>

<button
  className="btn-lavado secondary"

  disabled={
    paginaActual ===
    totalPaginas
  }

  onClick={() =>
    setPaginaActual(
      paginaActual + 1
    )
  }
>
  ➡
</button>

</div>

)
}

</div>

);

}

export default LavadoUnidades;