function CardLavado({

  lavado,
  onClick,
  onDownloadPDF,
  onContinuar

}) {

return (

<div
  className="lavado-card"
  onClick={onClick}
>

{/* HEADER */}

<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }}
>

<div
  style={{
    color: "#fff",
    fontWeight: "700",
    fontSize: "22px"
  }}
>
  🚛 {lavado.numeroUnidad}
</div>

<div
  style={{
    color: "#60a5fa",
    fontWeight: "700",
    fontSize: "13px"
  }}
>
  {lavado.folio}
</div>

</div>

{/* INFO */}

<div className="card-info-grid">

<div>
  👤 {lavado.operadores?.join(", ")}
</div>

<div>
  🧼 {lavado.tiposLavado?.join(", ")}
</div>

<div>
  📅 {
    new Date(
      lavado.createdAt
    ).toLocaleDateString(
      "es-MX",
      {
        timeZone:
          "America/Mexico_City"
      }
    )
  }
</div>

<div>
  👥 {
    lavado.cantidadOperadores
  } operador(es)
</div>

<div>
  👨‍🔧 Creó:
  {" "}
  {
    lavado.creadoPor ||
    "N/D"
  }
</div>

<div>
  📸 A:
  {
    lavado.fotosAntes?.length || 0
  }

  {" | "}

  D:
  {
    lavado.fotosDespues?.length || 0
  }
</div>

{
  lavado.aprobadoPor && (

<div>
  {
    lavado.estatus ===
    "RECHAZADA"

    ? "❌ "

    : "✅ "
  }

  {
    lavado.aprobadoPor
  }

</div>

  )
}

</div>

{/* BOTON CONTINUAR */}

{
lavado.estatus ===
"EN_PROCESO" && (

<button

className="btn-lavado"

onClick={(e) => {

  e.stopPropagation();

  onContinuar();

}}

style={{
  marginTop: "10px",
  width: "100%"
}}

>

▶ Continuar Lavado

</button>

)
}

{/* BOTON PDF */}

{
lavado.estatus ===
"APROBADA" && (

<button

className="btn-lavado secondary"

onClick={(e) => {

  e.stopPropagation();

  onDownloadPDF();

}}

style={{
  marginTop: "10px",
  width: "100%"
}}

>

📄 Descargar PDF

</button>

)
}

{/* STATUS */}

<div
  className={`status ${
    lavado.estatus ===
    "APROBADA"

      ? "status-aprobada"

      : lavado.estatus ===
        "RECHAZADA"

      ? "status-rechazada"

      : "status-pendiente"
  }`}
>
  {lavado.estatus}
</div>

</div>

);

}

export default CardLavado;