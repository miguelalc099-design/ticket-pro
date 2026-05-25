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