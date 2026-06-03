import tractoImg from "../assets/tracto.png";
import remolqueImg from "../assets/remolque.png";

function CardLavado({

  lavado,
  onClick,
  onDownloadPDF,
  onContinuar

}) {
const imagenUnidad =
  lavado.tipoUnidad?.toUpperCase() === "TRACTO"
    ? tractoImg
    : remolqueImg;

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

<div>

<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "12px"
  }}
>

 <img
  src={imagenUnidad}
  alt={lavado.tipoUnidad}
  style={{
    width: "50px",
    height: "auto",
    objectFit: "contain"
  }}
/>

  <div>

    <div
      style={{
        color: "#fff",
        fontWeight: "700",
        fontSize: "22px"
      }}
    >
      {lavado.numeroUnidad}
    </div>

  </div>

</div>

  <span
  style={{
    display: "inline-block",
    marginTop: "6px",
    background: "#1e293b",
    color: "#60a5fa",
    padding: "3px 8px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: "700"
  }}
>
  {lavado.tipoUnidad}
</span>

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