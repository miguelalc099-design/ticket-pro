import KPIsResumen from "../KPIsResumen";
import TablaCapturas from "../TablaCapturas";

function CapturaCiclico({

  ciclicoActivo,

  sku,
  setSku,

  busqueda,
  buscarDescripcion,

  resultados,
  setResultados,
  setBusqueda,

  buscarParaCiclico,

  item,
  setItem,

  conteo,
  setConteo,

  agregar,

  loading,

  conteoInputRef,
  skuInputRef,

  captura,

  totalSKUs,
  totalDiferencias,
  sobrantes,
  faltantes,
  ajusteTotal,

  setFiltroTabla,

  capturaFiltrada,

  setEditarItem,
  setNuevoConteoEdit,
  setEditarModal,

  toast,
  axios,
  API,

  setCaptura,
  cargarCiclicos,

  cerrarCiclico,
  setModo,

  setDuplicadoModal,
  setDuplicadoData,

}) {

  return (
<>

<h3>
  {ciclicoActivo.folio}
</h3>

<p>
  <b>{ciclicoActivo.titulo}</b>
</p>

<p>
  Estado: {ciclicoActivo.estado}
</p>

<hr />

<div style={{ marginTop: "30px" }} />

{ciclicoActivo.estado === "Abierto" && (
<>

<input
  ref={skuInputRef}
  className="input-pro"
  placeholder="🔍 Escanea o escribe SKU"
  value={sku}

  onChange={(e) =>
    setSku(e.target.value)
  }

  onKeyDown={(e) => {

    if (e.key === "Enter") {
      buscarParaCiclico();
    }
  }}
/>

<div style={{ marginTop: "20px" }} />

<input
  className="input-pro"
  type="text"
  placeholder="🔍 Buscar descripción..."
  value={busqueda}

  onChange={(e) =>
    buscarDescripcion(e.target.value)
  }
/>

{resultados.length > 0 && (

<div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "15px",
    marginBottom: "60px",
    position: "relative",
    zIndex: 20
  }}
>

{resultados.map((r, index) => (

<div
  key={index}

  onClick={async () => {

    try {

      const inv = await axios.get(
        API + "/inventario/" + r.sku
      );

      const cat = await axios.get(
        API + "/catalogo/" + r.sku
      );

      setSku(r.sku);

      setItem({

        sku: r.sku,

        articulo:
          inv.data?.articulo ||
          r.articulo,

        existencia:
          inv.data?.existencia || 0,

        costo:
          inv.data?.costo || 0,

        ubicacion:
          cat.data?.ubicacion || "N/A"
      });

      setResultados([]);

      setBusqueda("");

      setTimeout(() => {

        conteoInputRef.current?.focus();

      }, 100);

    } catch (err) {

      console.log(err);
    }
  }}

  className="card-pro"

  style={{
    padding: "18px",
    cursor: "pointer"
  }}
>

<div>
  <strong>{r.sku}</strong>
</div>

<div>{r.articulo}</div>

<div>
  📍 {r.ubicacion || "Sin ubicación"}
</div>

<div>
  📦 {r.existencia}
</div>

</div>

))}

</div>
)}

{item && (

<div
  style={{
    marginTop: "20px",
    marginBottom: "20px"
  }}
>

<p>
  <b>Artículo:</b> {item.articulo}
</p>

<p>
  <b>Sistema:</b> {item.existencia || 0}
</p>

<p>
  <b>Ubicación:</b> {item.ubicacion || "N/A"}
</p>

<button
  className="btn-pro btn-secondary"

  onClick={() => {

    setDuplicadoModal(false);

    setDuplicadoData(null);

    setSku("");

    setItem(null);

    setConteo("");

    skuInputRef.current?.focus();
  }}

  style={{
    marginBottom: "15px"
  }}
>
  🗑 Limpiar
</button>

<div style={{ marginTop: "25px" }} />

<input
  ref={conteoInputRef}
  className="input-pro"
  type="number"
  placeholder="🔢 Conteo"
  value={conteo}

  onChange={(e) =>
    setConteo(e.target.value)
  }

  onKeyDown={(e) => {

    if (e.key === "Enter") {
      agregar();
    }
  }}
/>

<div style={{ marginTop: "18px" }} />

<button
  className="btn-pro"
  onClick={agregar}
  disabled={loading}
>
  {loading
    ? "⏳ Guardando..."
    : "Agregar"}
</button>

</div>
)}

</>
)}

{captura.length > 0 && (

<KPIsResumen
  totalSKUs={totalSKUs}
  totalDiferencias={totalDiferencias}
  sobrantes={sobrantes}
  faltantes={faltantes}
  ajusteTotal={ajusteTotal}
  setFiltroTabla={setFiltroTabla}
/>

)}

{captura.length > 0 && (

<TablaCapturas
  capturaFiltrada={capturaFiltrada}
  ciclicoActivo={ciclicoActivo}
  setEditarItem={setEditarItem}
  setNuevoConteoEdit={setNuevoConteoEdit}
  setEditarModal={setEditarModal}
  toast={toast}
  axios={axios}
  API={API}
  setCaptura={setCaptura}
  cargarCiclicos={cargarCiclicos}
/>

)}

<br />

<div
  style={{
    marginTop: "30px",
    display: "flex",
    gap: "12px",
    flexWrap: "wrap"
  }}
>

{ciclicoActivo.estado === "Abierto" && (

<button
  className="btn-pro btn-danger"
  onClick={cerrarCiclico}
>
  ✅ Finalizar Cíclico
</button>

)}

<button
  className="btn-pro btn-secondary"

  onClick={() => {

    setModo("lista");

    setItem(null);
  }}
>
  ← Volver
</button>

</div>

</>
  );
}

export default CapturaCiclico;