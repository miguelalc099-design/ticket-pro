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
  toast

}) {
const ciclicosFiltrados =
  filtroArea === "todos"

    ? ciclicos

    : ciclicos.filter(
        c => c.area === filtroArea
      );
  return (
<>

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

    padding: "25px"
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

{ciclicosFiltrados.map((c) => (

<div
  key={c._id}
  className="card-pro"
  style={{
    padding: "28px",
    marginBottom: "20px"
  }}
>

<h3>{c.folio}</h3>

<p><b>Título:</b> {c.titulo}</p>
<p>
  <b>Tipo:</b>
  {" "}
  {c.tipo || "ciclico"}
</p>

<p>
  <b>Área:</b>
  {" "}
  {c.area || "almacen"}
</p>

<p><b>Fecha:</b> {c.fecha}</p>

<p>
  <b>Creado por:</b>
  {" "}
  {c.creadoPor || "N/A"}
</p>

<p><b>Estado:</b> {c.estado}</p>

<p>
  <b>SKUs:</b>
  {" "}
  {c.totalCapturados}
</p>

<p>
  <b>Diferencias:</b>
  {" "}
  {c.diferencias}
</p>

<button
  className="btn-pro"
  onClick={() => abrirCiclico(c)}
>
  {c.estado === "Abierto"
    ? "▶ Continuar"
    : "👁 Ver"}
</button>

<button
  className="btn-pro btn-secondary"
  style={{ marginLeft: "10px" }}

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

))}

</>
  );
}

export default ListaCiclicos;