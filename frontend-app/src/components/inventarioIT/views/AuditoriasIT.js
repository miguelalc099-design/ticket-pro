import {
  useEffect,
  useState
} from "react";

import NuevaAuditoria
from "./NuevaAuditoria";

import AuditoriaActiva
from "./AuditoriaActiva";

import jsPDF from "jspdf";

import autoTable
from "jspdf-autotable";

function AuditoriasIT({

  equipos

}) {

/* =========================
   STATES
========================= */

const [
  auditorias,
  setAuditorias
] = useState([]);

const [
  creandoAuditoria,
  setCreandoAuditoria
] = useState(false);
const [
  auditoriaActiva,
  setAuditoriaActiva
] = useState(null);

const [
  paginaActual,
  setPaginaActual
] = useState(1);

const auditoriasPorPagina = 4;

/* =========================
   CARGAR AUDITORIAS
========================= */

useEffect(() => {

  obtenerAuditorias();

}, []);

const obtenerAuditorias =
  async () => {

  try {

    const res =
      await fetch(

"https://ticket-pro-backend.onrender.com/it/auditorias-generales"

      );

    const data =
      await res.json();

    setAuditorias(data);

  } catch (err) {

    console.log(err);
  }
};
/* =========================
   PDF AUDITORIA
========================= */

const descargarPDF =
  (auditoria) => {

  const doc =
    new jsPDF();

  /* =========================
     PORTADA
  ========================= */

  doc.setFontSize(22);

  doc.text(
    "AUDITORIA IT CORPORATIVA",
    20,
    25
  );

  doc.setFontSize(12);

  doc.text(
    `Auditoría: ${auditoria.nombreAuditoria}`,
    20,
    45
  );

  doc.text(
    `Auditor: ${auditoria.auditor}`,
    20,
    55
  );

  doc.text(
    `Estado: ${
      auditoria.finalizada
      ? "FINALIZADA"
      : "EN PROCESO"
    }`,
    20,
    65
  );

  doc.text(
    `Equipos auditados: ${
      auditoria.equipos.length
    }`,
    20,
    75
  );

  doc.text(
    `Fecha: ${
      new Date().toLocaleDateString()
    }`,
    20,
    85
  );

  /* =========================
     EQUIPOS
  ========================= */

  auditoria.equipos.forEach(

    (equipo, index) => {

    doc.addPage();

    doc.setFontSize(18);

    doc.text(
      `Equipo ${index + 1}`,
      20,
      20
    );

    doc.setFontSize(12);

    doc.text(
      `Nombre: ${equipo.nombreEquipo}`,
      20,
      35
    );

    doc.text(
      `Usuario: ${equipo.usuarioAsignado}`,
      20,
      45
    );

    doc.text(
      `Score: ${equipo.score}/100`,
      20,
      55
    );

    doc.text(
      `Estado: ${equipo.estado}`,
      20,
      65
    );

    autoTable(doc, {

      startY: 80,

      head: [[
        "Control",
        "Resultado"
      ]],

      body: [

        [
          "Password Inicio",
          equipo.passwordInicio
          ? "SI"
          : "NO"
        ],

        [
          "Bloqueo Automático",
          equipo.bloqueoAutomatico
          ? "SI"
          : "NO"
        ],

        [
          "MFA",
          equipo.mfaActivo
          ? "SI"
          : "NO"
        ],

        [
          "Antivirus",
          equipo.antivirusActivo
          ? "SI"
          : "NO"
        ],

        [
          "Escritorio Limpio",
          equipo.escritorioLimpio
          ? "SI"
          : "NO"
        ],

        [
          "USB No Autorizado",
          equipo.usbNoAutorizado
          ? "SI"
          : "NO"
        ],

        [
          "Serie Correcta",
          equipo.serieCorrecta
          ? "SI"
          : "NO"
        ]

      ]

    });

    doc.text(

      `Observaciones: ${
        equipo.observaciones || "N/A"
      }`,

      20,

      doc.lastAutoTable.finalY + 20
    );

  });

  /* =========================
     SAVE
  ========================= */

  doc.save(

`${auditoria.nombreAuditoria}.pdf`

  );
};
/* =========================
   NUEVA AUDITORIA
========================= */

if (creandoAuditoria) {

  return (

<NuevaAuditoria

  equipos={equipos}

  onCancel={() =>
    setCreandoAuditoria(false)
  }

  onGuardar={(nueva) => {

  setAuditorias([
    nueva,
    ...auditorias
  ]);

  setCreandoAuditoria(false);

  setAuditoriaActiva(
    nueva
  );

}}

/>

  );

}
/* =========================
   AUDITORIA ACTIVA
========================= */

if (auditoriaActiva) {

  return (

<AuditoriaActiva

  auditoria={
    auditoriaActiva
  }

  onCancelar={() =>
    setAuditoriaActiva(null)
  }

  onFinalizar={(
    auditoriaFinalizada
  ) => {

    setAuditorias(

      auditorias.map((a) =>

        a._id === auditoriaFinalizada._id

        ? auditoriaFinalizada

        : a

      )

    );

    setAuditoriaActiva(
      null
    );

  }}

/>

  );

}

/* =========================
   PAGINACION
========================= */

const indiceFinal =
  paginaActual *
  auditoriasPorPagina;

const indiceInicio =
  indiceFinal -
  auditoriasPorPagina;

const auditoriasPaginadas =
  auditorias.slice(
    indiceInicio,
    indiceFinal
  );

const totalPaginas =
  Math.ceil(
    auditorias.length /
    auditoriasPorPagina
  );

/* =========================
   JSX
========================= */

return (

<div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  }}
>

{/* HEADER */}

<div
  className="card-pro"

  style={{
    padding: "32px"
  }}
>

<div
  style={{
    display: "flex",

    justifyContent:
      "space-between",

    alignItems: "center",

    gap: "20px",

    flexWrap: "wrap"
  }}
>

<div>

<h1
  style={{
    marginTop: 0,
    color: "#fff"
  }}
>
  🛡 Auditorías IT
</h1>

<p
  style={{
    color: "#94a3b8",
    marginBottom: 0
  }}
>
  Auditorías corporativas
  de seguridad y compliance.
</p>

</div>

<button
  className="btn-pro"

  onClick={() =>
    setCreandoAuditoria(true)
  }
>
  ➕ Nueva Auditoría
</button>

</div>

</div>

{/* SIN AUDITORIAS */}

{
auditorias.length === 0 && (

<div
  className="card-pro"

  style={{
    padding: "60px",
    textAlign: "center"
  }}
>

<div
  style={{
    fontSize: "60px",
    marginBottom: "20px"
  }}
>
  🛡
</div>

<h2
  style={{
    color: "#fff"
  }}
>
  No existen auditorías
</h2>

<p
  style={{
    color: "#94a3b8"
  }}
>
  Genera tu primera auditoría IT corporativa.
</p>

</div>

)}

{/* AUDITORIAS */}

<div
  style={{
    display: "grid",
    gap: "22px"
  }}
>

{
auditoriasPaginadas.map((auditoria) => (

<div
  key={auditoria._id}

  className="card-pro"

  style={{
    padding: "28px",

    border:
      "1px solid rgba(59,130,246,0.25)"
  }}
>

<div
  style={{
    display: "flex",

    justifyContent:
      "space-between",

    alignItems: "center",

    gap: "20px",

    flexWrap: "wrap"
  }}
>

<div>

<h2
  style={{
    color: "#fff",
    marginTop: 0,
    marginBottom: "10px"
  }}
>
  📋 {auditoria.nombreAuditoria}
</h2>

<p
  style={{
    color: "#94a3b8",
    margin: 0
  }}
>
  👤 {auditoria.auditor}
</p>

</div>

<div
  style={{
    padding: "10px 16px",

    borderRadius: "14px",

    background:
      "rgba(59,130,246,0.14)",

    color: "#60a5fa",

    fontWeight: "700"
  }}
>
  {auditoria.tipoAuditoria}
</div>

</div>

{/* INFO */}

<div
  style={{
    display: "flex",

    gap: "20px",

    flexWrap: "wrap",

    marginTop: "24px"
  }}
>

<div
  style={{
    color: "#94a3b8"
  }}
>
  💻 Equipos:
  {" "}
  {auditoria.equipos.length}
</div>

<div
  style={{
    color: "#94a3b8"
  }}
>
  📅 {
    new Date(
      auditoria.fecha
    ).toLocaleDateString()
  }
</div>

<div
  style={{

    padding: "10px 16px",

    borderRadius: "14px",

    background:

      auditoria.finalizada

      ? "rgba(34,197,94,0.12)"

      : "rgba(245,158,11,0.12)",

    color:

      auditoria.finalizada

      ? "#22c55e"

      : "#f59e0b",

    fontWeight: "700"
  }}
>
  {
    auditoria.finalizada

    ? "✅ FINALIZADA"

    : "🕒 EN PROCESO"
  }
</div>

</div>

{/* BOTONES */}

<div
  style={{
    display: "flex",

    gap: "12px",

    marginTop: "26px",

    flexWrap: "wrap"
  }}
>

<button
  className="btn-pro"

  onClick={() =>
    setAuditoriaActiva(
      auditoria
    )
  }
>
  {
    auditoria.finalizada

    ? "👁 Ver Auditoría"

    : "▶ Continuar Auditoría"
  }
</button>

<button
  className="btn-pro btn-secondary"

  onClick={() =>
    descargarPDF(auditoria)
  }
>
  📄 PDF
</button>

<button
  className="btn-pro btn-secondary"
>
  📊 Excel
</button>

</div>

</div>

))
}

</div>

{/* =========================
   FOOTER PAGINACION
========================= */}

{
totalPaginas > 1 && (

<div
  style={{

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    gap: "20px",

    marginTop: "30px"
  }}
>

<button
  className="btn-pro btn-secondary"

  disabled={paginaActual === 1}

  onClick={() =>
    setPaginaActual(
      paginaActual - 1
    )
  }
>
  ⬅ Anterior
</button>

<div
  style={{
    color: "#fff",
    fontWeight: "700"
  }}
>
  Página {paginaActual}
  {" "}de{" "}
  {totalPaginas}
</div>

<button
  className="btn-pro btn-secondary"

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
  Siguiente ➡
</button>

</div>

)
}
</div>

);

}

export default AuditoriasIT;