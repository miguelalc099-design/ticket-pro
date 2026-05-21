import { useEffect, useState } from "react";

import ModalResolverSeguridad
from "./components/ModalResolverSeguridad";

import NuevoEquipo
from "./views/NuevoEquipo";

import ListaEquipos
from "./views/ListaEquipos";

import AuditoriasIT
from "./views/AuditoriasIT";

function InventarioIT() {

const API =
  "https://ticket-pro-backend.onrender.com";

/* =========================
   STATES
========================= */

const [vista, setVista] =
  useState("equipos");

const [equipos, setEquipos] =
  useState([]);

const [openResolver,
  setOpenResolver] =
  useState(false);

const [equipoResolver,
  setEquipoResolver] =
  useState(null);

/* =========================
   API
========================= */

const obtenerEquipos =
  async () => {

  try {

    const res =
      await fetch(
        `${API}/it/equipos`
      );

    const data =
      await res.json();

    setEquipos(data);

  } catch (err) {

    console.log(err);

  }

};

useEffect(() => {

  obtenerEquipos();

}, []);

/* =========================
   KPIs
========================= */

const totalEquipos =
  equipos.length;

const totalAlertas =
  equipos.filter((e) =>

    e.estadoSeguridad ===
      "alerta" ||

    e.estadoSeguridad ===
      "riesgo"

  ).length;

const totalRiesgo =
  equipos.filter((e) =>

    e.estadoSeguridad ===
      "riesgo"

  ).length;

const totalSeguro =
  equipos.filter((e) =>

    e.estadoSeguridad ===
      "seguro"

  ).length;

/* =========================
   JSX
========================= */

return (

<div className="main-pro">

{/* HERO */}

<div
  className="card-pro"

  style={{
    padding: "35px",

    marginBottom: "30px",

    background:
      "linear-gradient(145deg, rgba(37,99,235,0.18), rgba(124,58,237,0.14))",

    border:
      "1px solid rgba(59,130,246,0.18)"
  }}
>

<div
  style={{
    display: "flex",

    justifyContent:
      "space-between",

    alignItems: "center",

    flexWrap: "wrap",

    gap: "20px"
  }}
>

<div>

<h1
  className="ciclico-title"

  style={{
    marginBottom: "10px"
  }}
>
  💻 Inventario IT
</h1>

<p
  style={{
    color: "#94a3b8",

    maxWidth: "760px",

    lineHeight: "1.6",

    marginBottom: 0
  }}
>
  Administración corporativa de
  equipos, seguridad,
  contraseñas, MFA,
  antivirus y activos
  tecnológicos.
</p>

</div>

{/* KPIs */}

<div
  style={{
    display: "flex",

    gap: "14px",

    flexWrap: "wrap"
  }}
>

{/* EQUIPOS */}

<div
  style={{
    padding: "16px 20px",

    borderRadius: "18px",

    background:
      "rgba(15,23,42,0.55)",

    border:
      "1px solid rgba(51,65,85,0.7)",

    minWidth: "120px"
  }}
>

<div
  style={{
    color: "#64748b",
    fontSize: "13px"
  }}
>
  Equipos
</div>

<div
  style={{
    color: "#fff",

    fontSize: "28px",

    fontWeight: "700"
  }}
>
  {totalEquipos}
</div>

</div>

{/* ALERTAS */}

<div
  style={{
    padding: "16px 20px",

    borderRadius: "18px",

    background:
      "rgba(15,23,42,0.55)",

    border:
      "1px solid rgba(51,65,85,0.7)",

    minWidth: "120px"
  }}
>

<div
  style={{
    color: "#64748b",
    fontSize: "13px"
  }}
>
  Alertas
</div>

<div
  style={{
    color: "#f59e0b",

    fontSize: "28px",

    fontWeight: "700"
  }}
>
  {totalAlertas}
</div>

</div>

{/* RIESGO */}

<div
  style={{
    padding: "16px 20px",

    borderRadius: "18px",

    background:
      "rgba(15,23,42,0.55)",

    border:
      "1px solid rgba(51,65,85,0.7)",

    minWidth: "120px"
  }}
>

<div
  style={{
    color: "#64748b",
    fontSize: "13px"
  }}
>
  Riesgo
</div>

<div
  style={{
    color: "#ef4444",

    fontSize: "28px",

    fontWeight: "700"
  }}
>
  {totalRiesgo}
</div>

</div>

{/* SEGUROS */}

<div
  style={{
    padding: "16px 20px",

    borderRadius: "18px",

    background:
      "rgba(15,23,42,0.55)",

    border:
      "1px solid rgba(51,65,85,0.7)",

    minWidth: "120px"
  }}
>

<div
  style={{
    color: "#64748b",
    fontSize: "13px"
  }}
>
  Seguros
</div>

<div
  style={{
    color: "#22c55e",

    fontSize: "28px",

    fontWeight: "700"
  }}
>
  {totalSeguro}
</div>

</div>

</div>

</div>

</div>

{/* NAV */}

<div
  style={{
    display: "flex",

    gap: "12px",

    flexWrap: "wrap",

    marginBottom: "30px"
  }}
>

<button
  className={
    vista === "dashboard"

    ? "btn-pro"

    : "btn-pro btn-secondary"
  }

  onClick={() =>
    setVista("dashboard")
  }
>
  🛡 Auditorías IT
</button>

<button
  className={
    vista === "equipos"

    ? "btn-pro"

    : "btn-pro btn-secondary"
  }

  onClick={() =>
    setVista("equipos")
  }
>
  💻 Equipos
</button>

<button
  className={
    vista === "alertas"

    ? "btn-pro"

    : "btn-pro btn-secondary"
  }

  onClick={() =>
    setVista("alertas")
  }
>
  ⚠ Alertas
</button>

</div>

{/* =========================
   DASHBOARD
========================= */}

{vista === "dashboard" && (

<AuditoriasIT
  equipos={equipos}
/>

)}

{/* =========================
   AUDITORIAS
========================= */}

{vista === "dashboard" && (

<AuditoriasIT
  equipos={equipos}
/>

)}

{/* =========================
   EQUIPOS
========================= */}

{vista === "equipos" && (

<ListaEquipos

  equipos={equipos}

  recargarDashboard={
    obtenerEquipos
  }

  irNuevoEquipo={() =>
    setVista("nuevo")
  }

/>

)}

{/* =========================
   NUEVO EQUIPO
========================= */}

{vista === "nuevo" && (

<NuevoEquipo

  volverEquipos={() =>
    setVista("equipos")
  }

  recargarEquipos={
    obtenerEquipos
  }

/>

)}

{/* =========================
   ALERTAS
========================= */}

{vista === "alertas" && (

<div
  style={{
    display: "flex",

    flexDirection: "column",

    gap: "18px"
  }}
>

<h2
  style={{
    color: "#fff",
    marginTop: 0
  }}
>
  ⚠ Centro de Alertas IT
</h2>

{
equipos.filter((e) =>

  e.estadoSeguridad ===
    "alerta" ||

  e.estadoSeguridad ===
    "riesgo"

).length === 0 && (

<div
  className="card-pro"

  style={{
    padding: "30px",

    textAlign: "center",

    color: "#22c55e"
  }}
>

✅ No existen alertas activas

</div>

)}

{equipos.map((e) => {

  if (

    e.estadoSeguridad !==
      "alerta" &&

    e.estadoSeguridad !==
      "riesgo"

  ) {

    return null;
  }

  return (

<div
  key={e._id}

  className="card-pro"

  style={{
    padding: "24px",

    border:

      e.estadoSeguridad ===
      "riesgo"

      ? "1px solid rgba(239,68,68,0.35)"

      : "1px solid rgba(245,158,11,0.35)"
  }}
>

{/* HEADER */}

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
    marginBottom: "8px"
  }}
>
  💻 {e.nombreEquipo}
</h2>

<p
  style={{
    color: "#94a3b8",
    margin: 0
  }}
>
  👤 {e.usuarioAsignado}
</p>

</div>

<div
  style={{
    padding: "10px 16px",

    borderRadius: "14px",

    fontWeight: "700",

    background:

      e.estadoSeguridad ===
      "riesgo"

      ? "rgba(239,68,68,0.14)"

      : "rgba(245,158,11,0.14)",

    color:

      e.estadoSeguridad ===
      "riesgo"

      ? "#ef4444"

      : "#f59e0b"
  }}
>

{
  e.estadoSeguridad ===
  "riesgo"

  ? "🚨 RIESGO"

  : "⚠ ALERTA"
}

</div>

</div>

{/* ALERTAS */}

<div
  style={{
    display: "grid",

    gap: "14px",

    marginTop: "24px"
  }}
>

{
e.alertas?.map(
  (alerta, index) => (

<div
  key={index}

  style={{
    padding: "18px",

    borderRadius: "16px",

    background:
      "rgba(239,68,68,0.10)",

    border:
      "1px solid rgba(239,68,68,0.18)",

    color: "#fca5a5"
  }}
>

⚠ {alerta}

</div>

))
}

</div>

{/* BOTONES */}

<div
  style={{
    display: "flex",

    gap: "12px",

    marginTop: "24px",

    flexWrap: "wrap"
  }}
>

<button
  className="btn-pro btn-secondary"

  onClick={() => {

    setVista("equipos");

  }}
>
  👁 Ver Equipo
</button>

<button
  className="btn-pro"

  onClick={() => {

    setVista("equipos");

  }}
>
  ✏ Editar
</button>

<button
  className="btn-pro btn-secondary"

  onClick={() => {

    setEquipoResolver(e);

    setOpenResolver(true);

  }}

  style={{
    border:
      "1px solid rgba(34,197,94,0.4)",

    color: "#22c55e"
  }}
>
  ✅ Resolver
</button>

</div>

</div>

);

})}

</div>

)}

{/* =========================
   MODAL RESOLVER
========================= */}

{openResolver && (

<ModalResolverSeguridad

  equipo={equipoResolver}

  onClose={() =>
    setOpenResolver(false)
  }

  recargarEquipos={
    obtenerEquipos
  }

/>

)}

</div>

);

}

export default InventarioIT;