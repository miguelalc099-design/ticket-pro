import { useState } from "react";

import NuevoEquipo from "./views/NuevoEquipo";
import ListaEquipos from "./views/ListaEquipos";
function InventarioIT() {

const [vista, setVista] =
  useState("nuevo");

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
    justifyContent: "space-between",
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
    maxWidth: "700px",
    lineHeight: "1.6",
    marginBottom: 0
  }}
>
  Administración corporativa de equipos,
  seguridad, hardware y activos tecnológicos.
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
  0
</div>

</div>

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
  0
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
  📊 Dashboard
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
    vista === "nuevo"

    ? "btn-pro"

    : "btn-pro btn-secondary"
  }

  onClick={() =>
    setVista("nuevo")
  }
>
  ➕ Nuevo Equipo
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

{/* VISTAS */}

{vista === "dashboard" && (

<div className="card-pro">

<h2>
  📊 Dashboard IT
</h2>

<p style={{ color: "#94a3b8" }}>
  Próximamente métricas y estadísticas.
</p>

</div>

)}

{vista === "equipos" && (
  <ListaEquipos />
)}


{vista === "nuevo" && (
  <NuevoEquipo />
)}

{vista === "alertas" && (

<div className="card-pro">

<h2>
  ⚠ Alertas IT
</h2>

<p style={{ color: "#94a3b8" }}>
  Próximamente alertas automáticas.
</p>

</div>

)}

</div>

);
}

export default InventarioIT;