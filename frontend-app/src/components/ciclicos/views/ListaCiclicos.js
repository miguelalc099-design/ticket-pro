function ListaCiclicos({
  filtroArea,
  setFiltroArea,

  busqueda,
  buscarDescripcion,
  resultados,

  subirExcel,
  subirCatalogo,

  setModo,

  ciclicos,
  abrirCiclico,

  exportarExcelCiclico,
filtroMes,
setFiltroMes,
  toast

}) {

  const obtenerMes = (fecha) => {

  if (!fecha) return "";

  const partes = fecha.split("-");

  return `${partes[0]}-${partes[1]}`;
};

const ciclicosFiltrados = ciclicos.filter(c => {

  const cumpleArea =

    filtroArea === "todos"

      ? true

      : c.area === filtroArea;

  const cumpleMes =

    filtroMes === "todos"

      ? true

      : obtenerMes(c.fecha) === filtroMes;

  return (
    cumpleArea &&
    cumpleMes
  );
});
{/* HEADER */}

<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "18px",
    marginBottom: "35px"
  }}
>

  <div
    style={{
      width: "70px",
      height: "70px",
      borderRadius: "22px",

      background:
        "linear-gradient(145deg,#2563eb,#7c3aed)",

      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      fontSize: "34px",

      boxShadow:
        "0 10px 25px rgba(59,130,246,0.35)"
    }}
  >
    🛠
  </div>

  <div>

    <h2
      style={{
        margin: 0,
        fontSize: "34px",
        color: "#fff"
      }}
    >
      Herramientas
    </h2>

    <p
      style={{
        marginTop: "6px",
        color: "#94a3b8",
        fontSize: "16px"
      }}
    >
      Administra inventario y catálogo
    </p>

  </div>

</div>

{/* INVENTARIO */}

<div
  style={{
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(320px, 1fr))",

    gap: "25px",

    background:
      "rgba(15,23,42,0.7)",

    border:
      "1px solid #1e293b",

    borderRadius: "24px",

    padding: "25px",

    marginBottom: "25px"
  }}
>

<div>

<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "20px"
  }}
>

<div
  style={{
    width: "60px",
    height: "60px",
    borderRadius: "18px",

    background:
      "linear-gradient(145deg,#2563eb,#1d4ed8)",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    fontSize: "28px"
  }}
>
  📥
</div>

<div>

<h3
  style={{
    margin: 0,
    color: "#fff",
    fontSize: "28px"
  }}
>
  Actualizar Inventario
</h3>

<p
  style={{
    marginTop: "8px",
    color: "#94a3b8"
  }}
>
  Carga existencias y costos
</p>

</div>

</div>

<div
  style={{
    background:
      "rgba(37,99,235,0.12)",

    border:
      "1px solid rgba(59,130,246,0.25)",

    borderRadius: "14px",

    padding: "14px",

    color: "#93c5fd",

    fontSize: "15px"
  }}
>
  ℹ Formatos soportados:
  .xlsx / .xls
</div>

</div>

<div
  style={{
    border:
      "2px dashed rgba(59,130,246,0.5)",

    borderRadius: "24px",

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    padding: "30px"
  }}
>

<div
  style={{
    fontSize: "55px",
    marginBottom: "15px"
  }}
>
  ☁
</div>

<p
  style={{
    color: "#fff",
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px"
  }}
>
  Selecciona tu archivo
</p>

<label
  style={{
    background:
      "linear-gradient(145deg,#2563eb,#1d4ed8)",

    color: "#fff",

    padding: "14px 28px",

    borderRadius: "14px",

    cursor: "pointer",

    fontWeight: "bold",

    fontSize: "17px",

    boxShadow:
      "0 10px 20px rgba(37,99,235,0.35)"
  }}
>
  ⬆ Seleccionar archivo

  <input
    type="file"
    onChange={subirExcel}

    style={{
      display: "none"
    }}
  />
</label>

</div>

</div>

{/* CATALOGO */}

<div
  style={{
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(320px, 1fr))",

    gap: "25px",

    background:
      "rgba(15,23,42,0.7)",

    border:
      "1px solid #1e293b",

    borderRadius: "24px",

    padding: "25px",

    marginBottom: "25px"
  }}
>

<div>

<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "20px"
  }}
>

<div
  style={{
    width: "60px",
    height: "60px",
    borderRadius: "18px",

    background:
      "linear-gradient(145deg,#9333ea,#7e22ce)",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    fontSize: "28px"
  }}
>
  📋
</div>

<div>

<h3
  style={{
    margin: 0,
    color: "#fff",
    fontSize: "28px"
  }}
>
  Actualizar Catálogo
</h3>

<p
  style={{
    marginTop: "8px",
    color: "#94a3b8"
  }}
>
  Carga ubicaciones y artículos
</p>

</div>

</div>

<div
  style={{
    background:
      "rgba(147,51,234,0.12)",

    border:
      "1px solid rgba(168,85,247,0.25)",

    borderRadius: "14px",

    padding: "14px",

    color: "#d8b4fe",

    fontSize: "15px"
  }}
>
  ℹ Formatos soportados:
  .xlsx / .xls
</div>

</div>

<div
  style={{
    border:
      "2px dashed rgba(168,85,247,0.45)",

    borderRadius: "24px",

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    padding: "30px"
  }}
>

<div
  style={{
    fontSize: "55px",
    marginBottom: "15px"
  }}
>
  ☁
</div>

<p
  style={{
    color: "#fff",
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px"
  }}
>
  Selecciona tu archivo
</p>

<label
  style={{
    background:
      "linear-gradient(145deg,#9333ea,#7e22ce)",

    color: "#fff",

    padding: "14px 28px",

    borderRadius: "14px",

    cursor: "pointer",

    fontWeight: "bold",

    fontSize: "17px",

    boxShadow:
      "0 10px 20px rgba(147,51,234,0.35)"
  }}
>
  ⬆ Seleccionar archivo

  <input
    type="file"
    onChange={subirCatalogo}

    style={{
      display: "none"
    }}
  />
</label>

</div>

</div>

{/* BUSQUEDA */}

<div style={{ marginBottom: "20px" }}>

<input
  className="input-pro"
  type="text"
  placeholder="🔍 Buscar SKU o descripción..."
  value={busqueda}
  onChange={(e) =>
    buscarDescripcion(e.target.value)
  }
/>

</div>

{resultados.length > 0 && (

<div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "15px",
    marginBottom: "35px",
    position: "relative",
    zIndex: 20
  }}
>

{resultados.map((item, index) => (

<div
  key={index}
  className="card-pro"
  style={{
    padding: "18px"
  }}
>

<div>
  <strong>{item.sku}</strong>
</div>

<div>
  {item.articulo}
</div>

<div>
  📍 {item.ubicacion || "Sin ubicación"}
</div>

<div>
  📦 {item.existencia}
</div>

</div>

))}

</div>
)}

{/* DASHBOARD */}

<div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(240px,1fr))",

    gap: "20px",

    marginTop: "25px",
    marginBottom: "30px"
  }}
>

<div
  className="card-pro"
  style={{
    padding: "25px"
  }}
>

<div
  style={{
    fontSize: "42px",
    marginBottom: "10px"
  }}
>
  📦
</div>

<h3>Almacén</h3>

<p>
  🟢 Abiertos:
  {" "}
  {almacenAbiertos}
</p>

<p>
  🔴 Cerrados:
  {" "}
  {almacenCerrados}
</p>

<p>
  📋 Total:
  {" "}
  {almacen.length}
</p>

</div>

<div
  className="card-pro"
  style={{
    padding: "25px"
  }}
>

<div
  style={{
    fontSize: "42px",
    marginBottom: "10px"
  }}
>
  🛞
</div>

<h3>Llantas</h3>

<p>
  🟢 Abiertos:
  {" "}
  {llantasAbiertos}
</p>

<p>
  🔴 Cerrados:
  {" "}
  {llantasCerrados}
</p>

<p>
  📋 Total:
  {" "}
  {llantas.length}
</p>

</div>

</div>

{/* FILTROS */}
<select
  className="input-pro"

  value={filtroMes}

  onChange={(e) =>
    setFiltroMes(e.target.value)
  }

  style={{
    marginBottom: "20px",
    maxWidth: "260px"
  }}
>

<option value="todos">
  📅 Todos los meses
</option>

<option value="2026-01">
  Enero 2026
</option>

<option value="2026-02">
  Febrero 2026
</option>

<option value="2026-03">
  Marzo 2026
</option>

<option value="2026-04">
  Abril 2026
</option>

<option value="2026-05">
  Mayo 2026
</option>

<option value="2026-06">
  Junio 2026
</option>

<option value="2026-07">
  Julio 2026
</option>

<option value="2026-08">
  Agosto 2026
</option>

<option value="2026-09">
  Septiembre 2026
</option>

<option value="2026-10">
  Octubre 2026
</option>

<option value="2026-11">
  Noviembre 2026
</option>

<option value="2026-12">
  Diciembre 2026
</option>

</select>
<div
  style={{
    display: "flex",
    gap: "10px",
    marginBottom: "25px",
    flexWrap: "wrap"
  }}
>

<button
  className="btn-pro btn-secondary"

  onClick={() =>
    setFiltroArea("todos")
  }
>
  📋 Todos
</button>

<button
  className="btn-pro btn-secondary"

  onClick={() =>
    setFiltroArea("almacen")
  }
>
  📦 Almacén
</button>

<button
  className="btn-pro btn-secondary"

  onClick={() =>
    setFiltroArea("llantas")
  }
>
  🛞 Llantas
</button>

</div>

<button
  className="btn-pro"
  onClick={() => setModo("nuevo")}
>
  ➕ Nuevo Cíclico
</button>

<br /><br />

{ciclicos.length === 0 && (
  <p>No hay cíclicos</p>
)}

{/* LISTA */}

{ciclicosFiltrados.map((c) => (

<div
  key={c._id}

  className="card-pro"

  style={{

    padding: "18px 22px",

    marginBottom: "12px",

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    gap: "20px",

    flexWrap: "wrap"
  }}
>

{/* IZQUIERDA */}

<div
  style={{
    flex: 1,
    minWidth: "260px"
  }}
>

<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap"
  }}
>

<h3
  style={{
    margin: 0,
    fontSize: "22px"
  }}
>
  {c.folio}
</h3>

<div
  style={{
    background:

      c.estado === "Abierto"

      ? "rgba(34,197,94,0.15)"

      : "rgba(239,68,68,0.15)",

    color:

      c.estado === "Abierto"

      ? "#22c55e"

      : "#ef4444",

    padding: "4px 12px",

    borderRadius: "999px",

    fontSize: "12px",

    fontWeight: "bold"
  }}
>
  {c.estado}
</div>

<div
  style={{
    background:
      "rgba(59,130,246,0.15)",

    color: "#3b82f6",

    padding: "4px 12px",

    borderRadius: "999px",

    fontSize: "12px",

    fontWeight: "bold"
  }}
>
  {c.tipo}
</div>

</div>

<p
  style={{
    color: "#94a3b8",
    marginTop: "8px",
    marginBottom: "12px"
  }}
>
  {c.titulo}
</p>

<div
  style={{
    display: "flex",
    gap: "18px",
    flexWrap: "wrap",

    color: "#cbd5e1",

    fontSize: "14px"
  }}
>

<span>
  📅 {c.fecha}
</span>

<span>
  👤 {c.creadoPor}
</span>

<span>
  🏢 {c.area}
</span>

<span>
  📦 {c.totalCapturados}
</span>

<span>
  ⚠ {c.diferencias}
</span>

</div>

</div>

{/* DERECHA */}

<div
  style={{
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  }}
>

<button
  className="btn-pro"

  onClick={() =>
    abrirCiclico(c)
  }
>
  {c.estado === "Abierto"

    ? "▶ Continuar"

    : "👁 Ver"}
</button>

<button
  className="btn-pro btn-secondary"

  onClick={async () => {

    try {

      await exportarExcelCiclico(c);

    } catch (err) {

      console.log(err);

      toast.error(
        "Error exportando"
      );
    }
  }}
>
  📥 Excel
</button>

</div>

</div>

))}

</>
);
}

export default ListaCiclicos;