function EquipoCard() {

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
      "1px solid rgba(51,65,85,0.7)",

    transition: "0.25s",

    cursor: "pointer"
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

{/* ICON */}

<div
  style={{
    width: "72px",
    height: "72px",

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
  💻
</div>

{/* INFO */}

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
  PC-ADMON-01
</h2>

<p
  style={{
    marginTop: "6px",
    color: "#94a3b8",
    marginBottom: 0
  }}
>
  Miguel Alcalá
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
  Windows 11 Pro
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
  Defender
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
  Desktop
</div>

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
  2 Monitores
</div>

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

<div>
  🔐 Password segura
</div>

<div>
  🛡 Antivirus activo
</div>

<div>
  ⚡ Último acceso: hoy
</div>

</div>

</div>

</div>

{/* DERECHA */}

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