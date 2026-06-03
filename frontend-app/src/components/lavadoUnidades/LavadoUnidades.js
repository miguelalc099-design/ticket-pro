import {
  useEffect,
  useState
} from "react";
import socket
from "./socket";

import "./styles/lavados.css";

import NuevoLavado
from "./views/NuevoLavado";

import AprobacionesLavado
from "./views/AprobacionesLavado";

import CompletarLavado
from "./views/CompletarLavado";

import CardLavado
from "./components/CardLavado";

import {

  exportarExcelLavados

} from "../../utils/exportExcelLavados";

import jsPDF
from "jspdf";

import autoTable
from "jspdf-autotable";

import tractoImg from "../../assets/tracto.png";
import remolqueImg from "../../assets/remolque.png";

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

  lavadoEnProceso,
  setLavadoEnProceso

] = useState(null);

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

const [

  fechaInicio,
  setFechaInicio

] = useState("");

const [

  fechaFin,
  setFechaFin

] = useState("");

const [
  aplicarFiltroFecha,
  setAplicarFiltroFecha
] = useState(false);

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

  socket.on(
    "lavado_actualizado",
    () => {

      cargarLavados();

    }
  );

  return () => {

    socket.off(
      "lavado_actualizado"
    );

  };

}, []);

/* =========================
   FILTROS
========================= */

const hoy = new Date();

hoy.setHours(0, 0, 0, 0);

const lavadosFiltrados =
  lavados.filter((lavado) => {

    const fechaLavado =
      new Date(lavado.createdAt);

    fechaLavado.setHours(
      0,
      0,
      0,
      0
    );

    // FILTRO HOME = HOY

    if (!aplicarFiltroFecha) {

      if (
        fechaLavado.getTime() !==
        hoy.getTime()
      ) {
        return false;
      }

    } else {

      if (
        fechaInicio &&
        fechaLavado <
          new Date(fechaInicio)
      ) {
        return false;
      }

      if (
        fechaFin &&
        fechaLavado >
          new Date(
            fechaFin +
            "T23:59:59"
          )
      ) {
        return false;
      }

    }

    // FILTRO ESTATUS

    if (
      filtro !== "TODOS" &&
      lavado.estatus !== filtro
    ) {

      return false;

    }

    return true;

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

  user={usuario}

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
   COMPLETAR LAVADO
========================= */

if (
  lavadoEnProceso
) {

  return (

<CompletarLavado

  lavado={
    lavadoEnProceso
  }

  onClose={() => {

    setLavadoEnProceso(
      null
    );

  }}

  onFinalizado={() => {

    setLavadoEnProceso(
      null
    );

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
      lavado.createdAt
    ).toLocaleDateString(
      "es-MX",
      {
        timeZone:
          "America/Mexico_City"
      }
    )
  }`,
  20,
  105
);

doc.text(
  `Creado por: ${
    lavado.creadoPor || "N/D"
  }`,
  20,
  115
);

doc.text(
  `Supervisor: ${
    lavado.aprobadoPor || "N/D"
  }`,
  20,
  125
);

/* =========================
   TABLA
========================= */

autoTable(doc, {

startY: 140,

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

  {/* TOTAL HISTORICO */}
  <div className="kpi-card">

    <div className="kpi-icon blue">
      🚛
    </div>

    <div className="kpi-info">

      <span className="kpi-label">
        Total Histórico
      </span>

      <span className="kpi-number">
        {lavados.length}
      </span>

    </div>

  </div>

  {/* MOSTRANDO */}
  <div className="kpi-card">

    <div className="kpi-icon blue">
      👁
    </div>

    <div className="kpi-info">

      <span className="kpi-label">
        Mostrando
      </span>

      <span className="kpi-number">
        {lavadosFiltrados.length}
      </span>

    </div>

  </div>

  {/* PENDIENTES */}
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
          lavadosFiltrados.filter(
            (l) =>
              l.estatus === "EN_ESPERA"
          ).length
        }
      </span>

    </div>

  </div>

  {/* EN PROCESO */}
  <div className="kpi-card">

    <div className="kpi-icon blue">
      🔵
    </div>

    <div className="kpi-info">

      <span className="kpi-label">
        En Proceso
      </span>

      <span className="kpi-number">
        {
          lavadosFiltrados.filter(
            (l) =>
              l.estatus === "EN_PROCESO"
          ).length
        }
      </span>

    </div>

  </div>

  {/* APROBADAS */}
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
          lavadosFiltrados.filter(
            (l) =>
              l.estatus === "APROBADA"
          ).length
        }
      </span>

    </div>

  </div>

{/* RECHAZADAS */}
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
        lavadosFiltrados.filter(
          (l) =>
            l.estatus === "RECHAZADA"
        ).length
      }
    </span>

  </div>

</div>

</div>

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
    flexWrap: "wrap",
    alignItems: "center"
  }}
>

<input

  type="date"

  className="input-lavado"

  value={fechaInicio}

  onChange={(e) =>
    setFechaInicio(
      e.target.value
    )
  }

/>

<input

  type="date"

  className="input-lavado"

  value={fechaFin}

  onChange={(e) =>
    setFechaFin(
      e.target.value
    )
  }

/>

<button

  className="btn-lavado secondary"

  onClick={() => {

    if (
      !fechaInicio ||
      !fechaFin
    ) {

      return alert(
"Selecciona fechas"
      );
    }

    exportarExcelLavados(

      lavados,

      fechaInicio,

      fechaFin

    );

  }}

>

📊 Exportar Excel

</button>
<button
  className="btn-lavado"
  onClick={() => {

    if (
      !fechaInicio ||
      !fechaFin
    ) {
      return alert(
        "Selecciona ambas fechas"
      );
    }

    setAplicarFiltroFecha(true);

    setPaginaActual(1);

  }}
>
🔎 Aplicar Fechas
</button>

<button
  className="btn-danger"
  onClick={() => {

    setFechaInicio("");
    setFechaFin("");

    setAplicarFiltroFecha(false);

    setFiltro("TODOS");

    setPaginaActual(1);

  }}
>
🧹 Limpiar
</button>
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
  "EN_PROCESO",
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

  onDownloadPDF={() =>
    descargarPDF(lavado)
  }
onContinuar={() => {

  setLavadoEnProceso(
    lavado
  );

}}

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

<div
  className="modal-unidad"
  style={{
    display: "flex",
    alignItems: "center",
    gap: "12px"
  }}
>

  <img
    src={
      lavadoDetalle.tipoUnidad?.toUpperCase() === "TRACTO"
        ? tractoImg
        : remolqueImg
    }
    alt={lavadoDetalle.tipoUnidad}
    style={{
      width: "70px",
      height: "auto"
    }}
  />

  <span>
    {lavadoDetalle.numeroUnidad}
  </span>

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
  lavadoDetalle.createdAt
).toLocaleDateString(
    "es-MX",
    {
      timeZone:
        "America/Mexico_City"
    }
  )
}

</div>
</div>

<div className="modal-info-card">

<div className="modal-label">
👨‍🔧 Creó
</div>

<div className="modal-value">

{
  lavadoDetalle.creadoPor ||
  "N/D"
}

</div>

</div>

<div className="modal-info-card">

<div className="modal-label">

{
  lavadoDetalle.estatus ===
  "RECHAZADA"

  ? "❌ Rechazó"

  : "✅ Supervisor"
}

</div>

<div className="modal-value">

{
  lavadoDetalle.aprobadoPor ||
  "N/D"
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
(
lavadoDetalle.estatus ===
"APROBADA"

||

lavadoDetalle.estatus ===
"RECHAZADA"
) && (

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
  ).toLocaleString(
      "es-MX",
      {
        timeZone:
          "America/Mexico_City"
      }
    )

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

{
lavadoDetalle.fotosAntes?.length > 0 && (

<>

<div
  style={{
    color: "#60a5fa",
    fontWeight: "700",
    marginBottom: "10px"
  }}
>
📸 Fotos Antes
</div>

<div className="modal-gallery">

{
lavadoDetalle.fotosAntes.map(
(foto, index) => (

<img

  key={`antes-${index}`}

  src={foto}

  alt="antes"

  className="modal-gallery-image"

  onClick={() =>
    setImagenActiva(foto)
  }

/>

))
}

</div>

</>

)
}

{
lavadoDetalle.fotosDespues?.length > 0 && (

<>

<div
  style={{
    color: "#22c55e",
    fontWeight: "700",
    marginTop: "20px",
    marginBottom: "10px"
  }}
>
📸 Fotos Después
</div>

<div className="modal-gallery">

{
lavadoDetalle.fotosDespues.map(
(foto, index) => (

<img

  key={`despues-${index}`}

  src={foto}

  alt="despues"

  className="modal-gallery-image"

  onClick={() =>
    setImagenActiva(foto)
  }

/>

))
}

</div>

</>

)
}

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