import { useEffect, useState } from "react";

import EquipoCard
from "../components/EquipoCard";

import ModalDetalleEquipo
from "../components/ModalDetalleEquipo";

import ModalEditarEquipo
from "../components/ModalEditarEquipo";

import ModalSeguridadEquipo
from "../components/ModalSeguridadEquipo";

const API =
  "https://ticket-pro-backend.onrender.com";

function ListaEquipos({

  recargarDashboard,

  irNuevoEquipo

}) {

/* =========================
   STATES
========================= */

const [equipos, setEquipos] =
  useState([]);

const [loading, setLoading] =
  useState(true);

const [equipoSeleccionado,
  setEquipoSeleccionado] =
  useState(null);

const [openDetalle,
  setOpenDetalle] =
  useState(false);

const [openEditar,
  setOpenEditar] =
  useState(false);

const [openSeguridad,
  setOpenSeguridad] =
  useState(false);

const [equipoSeguridad,
  setEquipoSeguridad] =
  useState(null);

const [equipoEditar,
  setEquipoEditar] =
  useState(null);

const [busqueda,
  setBusqueda] =
  useState("");

const [filtroTipo,
  setFiltroTipo] =
  useState("todos");

const [filtroEstado,
  setFiltroEstado] =
  useState("todos");

/* =========================
   API
========================= */

const obtenerEquipos =
  async () => {

  try {

    setLoading(true);

    const res =
      await fetch(
        `${API}/it/equipos`
      );

    const data =
      await res.json();

    setEquipos(data);

  } catch (err) {

    console.log(err);

  } finally {

    setLoading(false);

  }

};

useEffect(() => {

  obtenerEquipos();

}, []);

/* =========================
   HELPERS
========================= */

function obtenerEstado(equipo) {

  return (
    equipo.estadoSeguridad ||
    "seguro"
  );

}

/* =========================
   KPIs
========================= */

const equiposSeguros =
  equipos.filter(
    (e) =>
      obtenerEstado(e) ===
      "seguro"
  ).length;

const equiposAlerta =
  equipos.filter(
    (e) =>
      obtenerEstado(e) ===
      "alerta"
  ).length;

const equiposRiesgo =
  equipos.filter(
    (e) =>
      obtenerEstado(e) ===
      "riesgo"
  ).length;

const mfaDesactivado =
  equipos.filter(
    (e) => !e.mfa
  ).length;

const antivirusVencido =
  equipos.filter((e) => {

    if (
      !e.fechaExpiracionAntivirus
    ) {

      return false;

    }

    if (
      e.antivirus ===
      "Microsoft Defender"
    ) {

      return false;

    }

    const hoy =
      new Date();

    const fecha =
      new Date(
        e.fechaExpiracionAntivirus
      );

    hoy.setHours(0,0,0,0);

    fecha.setHours(0,0,0,0);

    const dias =
      Math.ceil(
        (
          fecha - hoy
        ) /
        (1000 * 60 * 60 * 24)
      );

    return dias < 0;

  }).length;

/* =========================
   FILTROS
========================= */

const equiposFiltrados =
  equipos.filter((e) => {

    const texto =
      `
        ${e.nombreEquipo || ""}
        ${e.usuarioAsignado || ""}
        ${e.antivirus || ""}
        ${e.windows || ""}
      `
      .toLowerCase();

    const matchBusqueda =
      texto.includes(
        busqueda.toLowerCase()
      );

    const matchTipo =

      filtroTipo === "todos"

      ? true

      : e.tipoEquipo ===
        filtroTipo;

    const matchEstado =

      filtroEstado === "todos"

      ? true

      : obtenerEstado(e) ===
        filtroEstado;

    return (

      matchBusqueda &&
      matchTipo &&
      matchEstado

    );

  });

/* =========================
   JSX
========================= */

return (

<div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "20px"
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
    margin: 0,
    color: "#fff",
    fontSize: "32px"
  }}
>
  💻 Equipos Registrados
</h2>

<p
  style={{
    marginTop: "8px",
    color: "#94a3b8"
  }}
>
  Administración y monitoreo
  corporativo de seguridad IT
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
  className="btn-pro"

  onClick={irNuevoEquipo}
>
  ➕ Nuevo Equipo
</button>

</div>

</div>

{/* DASHBOARD */}

<div
  style={{
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",

    gap: "18px"
  }}
>

{/* SEGUROS */}

<div
  className="card-pro"

  style={{
    padding: "22px",

    border:
      "1px solid rgba(34,197,94,0.3)"
  }}
>

<h3
  style={{
    margin: 0,
    color: "#22c55e"
  }}
>
  🟢 Seguros
</h3>

<h1
  style={{
    color: "#fff",
    marginBottom: 0
  }}
>
  {equiposSeguros}
</h1>

</div>

{/* ALERTAS */}

<div
  className="card-pro"

  style={{
    padding: "22px",

    border:
      "1px solid rgba(245,158,11,0.3)"
  }}
>

<h3
  style={{
    margin: 0,
    color: "#f59e0b"
  }}
>
  🟡 Alertas
</h3>

<h1
  style={{
    color: "#fff",
    marginBottom: 0
  }}
>
  {equiposAlerta}
</h1>

</div>

{/* RIESGO */}

<div
  className="card-pro"

  style={{
    padding: "22px",

    border:
      "1px solid rgba(239,68,68,0.3)"
  }}
>

<h3
  style={{
    margin: 0,
    color: "#ef4444"
  }}
>
  🔴 Riesgo
</h3>

<h1
  style={{
    color: "#fff",
    marginBottom: 0
  }}
>
  {equiposRiesgo}
</h1>

</div>

{/* MFA OFF */}

<div
  className="card-pro"

  style={{
    padding: "22px"
  }}
>

<h3
  style={{
    margin: 0,
    color: "#60a5fa"
  }}
>
  🔐 MFA OFF
</h3>

<h1
  style={{
    color: "#fff",
    marginBottom: 0
  }}
>
  {mfaDesactivado}
</h1>

</div>

{/* ANTIVIRUS */}

<div
  className="card-pro"

  style={{
    padding: "22px"
  }}
>

<h3
  style={{
    margin: 0,
    color: "#f97316"
  }}
>
  🛡 Antivirus vencido
</h3>

<h1
  style={{
    color: "#fff",
    marginBottom: 0
  }}
>
  {antivirusVencido}
</h1>

</div>

</div>

{/* FILTROS */}

<div
  className="card-pro"

  style={{
    padding: "22px"
  }}
>

<div
  style={{
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(260px,1fr))",

    gap: "18px"
  }}
>

{/* BUSQUEDA */}

<input
  className="input-pro"

  placeholder="🔍 Buscar equipo, usuario, windows o antivirus..."

  value={busqueda}

  onChange={(e) =>
    setBusqueda(
      e.target.value
    )
  }
/>

{/* TIPO */}

<select

  className="input-pro"

  value={filtroTipo}

  onChange={(e) =>
    setFiltroTipo(
      e.target.value
    )
  }
>

<option value="todos">
  Todos los equipos
</option>

<option value="laptop">
  Laptop
</option>

<option value="desktop">
  Desktop
</option>

</select>

{/* ESTADO */}

<select

  className="input-pro"

  value={filtroEstado}

  onChange={(e) =>
    setFiltroEstado(
      e.target.value
    )
  }
>

<option value="todos">
  Todos los estados
</option>

<option value="seguro">
  Seguros
</option>

<option value="alerta">
  Alertas
</option>

<option value="riesgo">
  Riesgo
</option>

</select>

</div>

</div>

{/* LISTA */}

<div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "18px"
  }}
>

{/* LOADING */}

{loading && (

<div
  className="card-pro"

  style={{
    padding: "30px",
    color: "#94a3b8"
  }}
>

  Cargando equipos...

</div>

)}

{/* VACIO */}

{!loading &&
 equipos.length === 0 && (

<div
  className="card-pro"

  style={{
    padding: "30px",
    color: "#94a3b8"
  }}
>

  No hay equipos registrados.

</div>

)}

{/* SIN RESULTADOS */}

{!loading &&
 equipos.length > 0 &&
 equiposFiltrados.length === 0 && (

<div
  className="card-pro"

  style={{
    padding: "30px",
    color: "#94a3b8"
  }}
>

  No se encontraron equipos.

</div>

)}

{/* CARDS */}

{equiposFiltrados.map((equipo) => (

<EquipoCard

  key={equipo._id}

  equipo={equipo}

  nombreEquipo={
    equipo.nombreEquipo
  }

  usuarioAsignado={
    equipo.usuarioAsignado
  }

  windows={
    equipo.windows
  }

  antivirus={
    equipo.antivirus
  }

  tipoEquipo={
    equipo.tipoEquipo
  }

  monitores={
    equipo.monitores
  }

  estadoSeguridad={
    equipo.estadoSeguridad
  }

  onVer={() => {

    setEquipoSeleccionado(
      equipo
    );

    setOpenDetalle(true);

  }}

  onEditar={() => {

    setEquipoEditar(
      equipo
    );

    setOpenEditar(true);

  }}

  onSeguridad={() => {

    setEquipoSeguridad(
      equipo
    );

    setOpenSeguridad(true);

  }}

/>

))}

</div>

{/* DETALLE */}

{openDetalle && (

<ModalDetalleEquipo

  equipo={
    equipoSeleccionado
  }

  onClose={() =>
    setOpenDetalle(false)
  }

/>

)}

{/* EDITAR */}

{openEditar && (

<ModalEditarEquipo

  equipo={equipoEditar}

  onClose={() =>
    setOpenEditar(false)
  }

  recargarEquipos={() => {

    obtenerEquipos();

    recargarDashboard();

  }}

/>

)}

{/* SEGURIDAD */}

{openSeguridad && (

<ModalSeguridadEquipo

  equipo={equipoSeguridad}

  onClose={() =>
    setOpenSeguridad(false)
  }

/>

)}

</div>

);

}

export default ListaEquipos;