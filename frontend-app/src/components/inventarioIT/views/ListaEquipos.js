import { useEffect, useState } from "react";

import EquipoCard from "../components/EquipoCard";
import ModalDetalleEquipo
from "../components/ModalDetalleEquipo";

const API =
  "https://ticket-pro-backend.onrender.com";

function ListaEquipos() {

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
const obtenerEquipos =
  async () => {

  try {

    const res = await fetch(
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
    justifyContent: "space-between",
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
  Administración y monitoreo corporativo
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
  className="btn-pro btn-secondary"
>
  🔍 Filtrar
</button>

<button
  className="btn-pro"
>
  ➕ Nuevo Equipo
</button>

</div>

</div>

{/* SEARCH */}

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

<input
  className="input-pro"

  placeholder="🔍 Buscar equipo, usuario o serial..."
/>

<select className="input-pro">

<option>
  Todos los equipos
</option>

<option>
  Laptop
</option>

<option>
  Desktop
</option>

</select>

<select className="input-pro">

<option>
  Todos los estados
</option>

<option>
  Seguros
</option>

<option>
  Alertas
</option>

<option>
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

{loading && (

<div className="card-pro">
  Cargando equipos...
</div>

)}

{!loading &&
 equipos.length === 0 && (

<div className="card-pro">
  No hay equipos registrados.
</div>

)}

{equipos.map((equipo) => (

<EquipoCard

  key={equipo._id}

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

/>
))}

</div>
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
</div>

);
}

export default ListaEquipos;