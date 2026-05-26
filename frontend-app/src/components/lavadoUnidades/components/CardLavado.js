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

<div
  style={{

    display: "flex",

    justifyContent:
      "space-between",

    alignItems:
      "center"
  }}
>

<div>

<div
  style={{
    color: "#fff",
    fontWeight: "700",
    fontSize: "18px"
  }}
>
  🚛 {lavado.numeroUnidad}
</div>

<div
  style={{
    color: "#94a3b8",
    marginTop: "6px"
  }}
>
  👤 {
    lavado.operadores?.join(", ")
  }
</div>

</div>

<div
  style={{
    color: "#60a5fa",
    fontWeight: "700"
  }}
>
  {lavado.folio}
</div>

</div>

<div
  style={{
    color: "#cbd5e1"
  }}
>
  🧼 {
    lavado.tiposLavado?.join(", ")
  }
</div>

<div
  style={{
    color: "#94a3b8"
  }}
>
  👥 {
    lavado.cantidadOperadores
  } operador(es)
</div>

<div
  style={{
    color: "#94a3b8"
  }}
>
  📅 {
    new Date(
      lavado.fechaLavado
    ).toLocaleDateString()
  }
</div>

{/* =========================
   GALERIA
========================= */}

{
(
lavado.fotosAntes?.length > 0 ||

lavado.fotosDespues?.length > 0
) && (

<div className="card-gallery">

{/* ANTES */}

{
lavado.fotosAntes?.map(
(foto, index) => (

<img

  key={`antes-${index}`}

  src={foto}

  alt="antes"

  className="card-gallery-image"

/>

))
}

{/* DESPUES */}

{
lavado.fotosDespues?.map(
(foto, index) => (

<img

  key={`despues-${index}`}

  src={foto}

  alt="despues"

  className="card-gallery-image"

/>

))
}

</div>

)
}
<div className="lavado-photo-badge">

📸 {

(lavado.fotosAntes?.length || 0)

+

(lavado.fotosDespues?.length || 0)

} fotos

</div>

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
  marginTop: "14px",
  width: "100%"
}}

>

▶ Continuar Lavado

</button>

)
}

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
  marginTop: "14px",
  width: "100%"
}}

>

📄 Descargar PDF

</button>

)
}

<div
  className={`
    status
    ${
      lavado.estatus ===
      "APROBADA"

      ? "status-aprobada"

      : lavado.estatus ===
        "RECHAZADA"

      ? "status-rechazada"

      : "status-pendiente"
    }
  `}
>
  {lavado.estatus}
</div>

</div>

);

}

export default CardLavado;