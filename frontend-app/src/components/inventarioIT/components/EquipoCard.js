function EquipoCard({

  nombreEquipo,

  usuarioAsignado,

  windows,

  antivirus,

  tipoEquipo,

  monitores,

  estadoSeguridad

}) {

const colorEstado = {

  seguro: "#22c55e",

  alerta: "#f59e0b",

  riesgo: "#ef4444"

};

return (

<div
  className="card-pro"

  style={{
    padding: "24px",

    display: "flex",

    justifyContent:
      "space-between",

    alignItems: "center",

    gap: "24px",

    flexWrap: "wrap",

    background:
      "linear-gradient(145deg, rgba(15,23,42,0.92), rgba(15,23,42,0.78))",

    border:
      "1px solid rgba(51,65,85,0.7)"
  }}
>

{/* IZQUIERDA */}

<div
  style={{
    display: "flex",
    gap: "20px",
    alignItems: "center",
    flex: 1
  }}
>

<div
  style={{
    width: "72px",
    height: "72px",

    borderRadius: "22px",

    background:
      tipoEquipo === "desktop"

      ? "linear-gradient(145deg,#2563eb,#7c3aed)"

      : "linear-gradient(145deg,#0f766e,#14b8a6)",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    fontSize: "34px",

    boxShadow:
      "0 10px 25px rgba(59,130,246,0.35)"
  }}
>
  {tipoEquipo === "desktop"
    ? "🖥"
    : "💻"}
</div>

<div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  }}
>

<div>

<h2
  style={{
    margin: 0,
    color: "#fff",
    fontSize: "24px"
  }}
>
  {nombreEquipo}
</h2>

<p
  style={{
    marginTop: "6px",
    color: "#94a3b8",
    marginBottom: 0
  }}
>
  {usuarioAsignado}
</p>

</div>

{/* BADGES */}

<div
  style={{
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  }}
>

<div
  style={{
    background:
      "rgba(59,130,246,0.15)",

    color: "#60a5fa",

    padding: "6px 12px",

    borderRadius: "999px",

    fontSize: "13px",

    fontWeight: "600"
  }}
>
  {windows}
</div>

<div
  style={{
    background:
      "rgba(16,185,129,0.15)",

    color: "#34d399",

    padding: "6px 12px",

    borderRadius: "999px",

    fontSize: "13px",

    fontWeight: "600"
  }}
>
  {antivirus || "Sin antivirus"}
</div>

<div
  style={{
    background:
      "rgba(124,58,237,0.15)",

    color: "#c084fc",

    padding: "6px 12px",

    borderRadius: "999px",

    fontSize: "13px",

    fontWeight: "600"
  }}
>
  {tipoEquipo}
</div>

{tipoEquipo === "desktop" && (

<div
  style={{
    background:
      "rgba(245,158,11,0.15)",

    color: "#fbbf24",

    padding: "6px 12px",

    borderRadius: "999px",

    fontSize: "13px",

    fontWeight: "600"
  }}
>
  {monitores?.length || 0}
  {" "}Monitores
</div>

)}

</div>

{/* STATUS */}

<div
  style={{
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",

    color: "#94a3b8",
    fontSize: "14px"
  }}
>

<div
  style={{
    color:
      colorEstado[
        estadoSeguridad
      ]
  }}
>
  ● {estadoSeguridad}
</div>

<div>
  🛡 Seguridad IT
</div>

</div>

</div>

</div>

{/* BOTONES */}

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
  👁 Ver
</button>

<button
  className="btn-pro btn-secondary"
>
  🔐 Seguridad
</button>

<button
  className="btn-pro"
>
  ✏ Editar
</button>

</div>

</div>

);
}

export default EquipoCard;