function TablaCapturas({
  capturaFiltrada,
  ciclicoActivo,
  setEditarItem,
  setNuevoConteoEdit,
  setEditarModal,
  toast,
  axios,
  API,
  setCaptura,
  cargarCiclicos
}) {

  return (

<div
  style={{
    overflowX: "auto",
    marginTop: "20px"
  }}
>

<table className="table-pro">

<thead
  style={{
    background: "#111"
  }}
>
<tr>

<th style={{ padding: "12px" }}>SKU</th>

<th style={{ padding: "12px" }}>
  Artículo
</th>

<th style={{ padding: "12px" }}>
  Ubicación
</th>

<th style={{ padding: "12px" }}>
  Sistema
</th>

<th style={{ padding: "12px" }}>
  Conteo
</th>

<th style={{ padding: "12px" }}>
  Diferencia
</th>

<th style={{ padding: "12px" }}>
  Costo Unidad
</th>

<th style={{ padding: "12px" }}>
  Ajuste $
</th>

<th style={{ padding: "12px" }}>
  Acciones
</th>

</tr>
</thead>

<tbody>

{capturaFiltrada.map((i) => {

const diferenciaCalculada =

  Number(i.conteo || 0) -

  Number(i.sistema || 0);

return (

<tr
  key={i._id}

  style={{

    borderBottom: "1px solid #333",

    background:

      diferenciaCalculada > 0
        ? "rgba(34,197,94,0.15)"

      : diferenciaCalculada < 0
        ? "rgba(239,68,68,0.15)"

      : "#1e1e1e"
  }}
>

<td style={{ padding: "12px" }}>
  {i.sku}
</td>

<td style={{ padding: "12px" }}>
  {i.articulo}
</td>

<td style={{ padding: "12px" }}>
  {i.ubicacion}
</td>

<td style={{ padding: "12px" }}>
  {i.sistema}
</td>

<td style={{ padding: "12px" }}>
  {i.conteo}
</td>

<td
  style={{
    padding: "12px",

    color:
      diferenciaCalculada !== 0
        ? "#ff4d4f"
        : "#52c41a",

    fontWeight: "bold"
  }}
>
  {diferenciaCalculada}
</td>

<td style={{ padding: "12px" }}>
  $
  {Number(i.costo || 0)
    .toLocaleString()}
</td>

<td
  style={{
    padding: "12px",

    color:
      diferenciaCalculada *
      Number(i.costo || 0) < 0
        ? "#ff4d4f"
        : "#52c41a",

    fontWeight: "bold"
  }}
>
  $
  {(
    diferenciaCalculada *
    Number(i.costo || 0)
  ).toLocaleString()}
</td>

<td style={{ padding: "12px" }}>

{ciclicoActivo.estado === "Abierto" && (
<>

<button
  className="btn-pro btn-secondary"

  onClick={() => {

    setEditarItem(i);

    setNuevoConteoEdit(
      i.conteo
    );

    setEditarModal(true);
  }}

  style={{
    padding: "8px 12px",
    fontSize: "14px"
  }}
>
  ✏ Editar
</button>

<button
  className="btn-pro btn-danger"

  onClick={async () => {

    const confirmar = window.confirm(
      "¿Eliminar captura?"
    );

    if (!confirmar) return;

    try {

      await axios.delete(
        API + "/capturas/" + i._id
      );

      toast.success("Eliminado 🔥");

      const nuevasCapturas =
        await axios.get(
          API +
          "/ciclicos/" +
          ciclicoActivo._id +
          "/capturas"
        );

      setCaptura(
        nuevasCapturas.data
      );

      await cargarCiclicos();

    } catch (err) {

      console.log(err);

      toast.error(
        "Error eliminando"
      );
    }
  }}

  style={{
    padding: "8px 12px",
    fontSize: "14px",
    marginLeft: "8px"
  }}
>
  🗑 Eliminar
</button>

</>
)}

</td>

</tr>

);

})}

</tbody>

</table>

</div>

  );
}

export default TablaCapturas;