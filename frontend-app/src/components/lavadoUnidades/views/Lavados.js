import {

  useEffect,
  useState

} from "react";

import CardLavado
from "../components/CardLavado";

import "../styles/lavados.css";

function Lavados() {

/* =========================
   STATES
========================= */

const [

  lavados,
  setLavados

] = useState([]);

const [

  paginaActual,
  setPaginaActual

] = useState(1);

const registrosPorPagina = 10;

/* =========================
   OBTENER
========================= */

useEffect(() => {

  obtenerLavados();

}, []);

const obtenerLavados =
async () => {

  try {

    const res =
      await fetch(

"http://localhost:3001/lavados"

      );

    const data =
      await res.json();

    setLavados(data);

  } catch (err) {

    console.log(err);
  }
};

/* =========================
   KPIS
========================= */

const aprobadas =
  lavados.filter(

    (l) =>
      l.estatus ===
      "APROBADA"

  ).length;

const pendientes =
  lavados.filter(

    (l) =>
      l.estatus ===
      "EN_ESPERA"

  ).length;

const rechazadas =
  lavados.filter(

    (l) =>
      l.estatus ===
      "RECHAZADA"

  ).length;

/* =========================
   PAGINACION
========================= */

const indiceFinal =
  paginaActual *
  registrosPorPagina;

const indiceInicio =
  indiceFinal -
  registrosPorPagina;

const lavadosPaginados =
  lavados.slice(

    indiceInicio,
    indiceFinal

  );

const totalPaginas =
  Math.ceil(

    lavados.length /
    registrosPorPagina

  );

/* =========================
   JSX
========================= */

return (

<div
  className="lavados-container"
>

{/* HEADER */}

<div
  className="lavados-header"
>

<div>

<div
  className="lavados-title"
>
  🚛 Lavado de Unidades
</div>

<div
  className="lavados-subtitle"
>
  Gestión corporativa
  de lavados móviles.
</div>

</div>

<button
  className="btn-lavado"
>
  ➕ Nuevo Lavado
</button>

</div>

{/* KPIS */}

<div
  className="kpis-grid"
>

<div
  className="kpi-card"
>
  <div className="kpi-title">
    Pendientes
  </div>

  <div className="kpi-value">
    {pendientes}
  </div>
</div>

<div
  className="kpi-card"
>
  <div className="kpi-title">
    Aprobadas
  </div>

  <div className="kpi-value">
    {aprobadas}
  </div>
</div>

<div
  className="kpi-card"
>
  <div className="kpi-title">
    Rechazadas
  </div>

  <div className="kpi-value">
    {rechazadas}
  </div>
</div>

<div
  className="kpi-card"
>
  <div className="kpi-title">
    Total
  </div>

  <div className="kpi-value">
    {lavados.length}
  </div>
</div>

</div>

{/* LISTADO */}

<div
  style={{
    display: "grid",
    gap: "16px"
  }}
>

{
lavadosPaginados.map(
  (lavado) => (

<CardLavado

  key={lavado._id}

  lavado={lavado}

/>

))
}

</div>

{/* PAGINACION */}

{
totalPaginas > 1 && (

<div
  className="pagination"
>

<button
  className="btn-lavado"

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
  style={{
    color: "#fff"
  }}
>
  Página {paginaActual}
</div>

<button
  className="btn-lavado"

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

export default Lavados;