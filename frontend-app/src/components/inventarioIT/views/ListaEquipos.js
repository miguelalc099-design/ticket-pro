import EquipoCard from "../components/EquipoCard";

function ListaEquipos() {

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

{/* ACTIONS */}

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

<EquipoCard />
<EquipoCard />
<EquipoCard />

</div>

</div>

);
}

export default ListaEquipos;