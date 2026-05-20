function ModalSeguridadEquipo({

  equipo,

  onClose

}) {

const hoy = new Date();

const fechaAntivirus =
  new Date(
    equipo?.fechaExpiracionAntivirus
  );

const fechaPassword =
  new Date(
    equipo?.fechaCambioPasswordWindows
  );

const diasAntivirus =
  Math.ceil(
    (
      fechaAntivirus - hoy
    ) /
    (1000 * 60 * 60 * 24)
  );

const diasPassword =
  Math.ceil(
    (
      hoy - fechaPassword
    ) /
    (1000 * 60 * 60 * 24)
  );

const alertas = [];

if (diasAntivirus <= 0) {

  alertas.push({
    tipo: "critico",
    mensaje:
      "Antivirus vencido"
  });

}

if (

  diasAntivirus > 0 &&

  diasAntivirus <=
    equipo?.diasAlertaAntivirus

) {

  alertas.push({
    tipo: "alerta",
    mensaje:
      `Antivirus vence en ${diasAntivirus} días`
  });

}

if (

  diasPassword >=
    equipo?.diasRecordatorioPassword

) {

  alertas.push({
    tipo: "alerta",
    mensaje:
      "Cambio de password requerido"
  });

}

if (!equipo?.mfa) {

  alertas.push({
    tipo: "critico",
    mensaje:
      "MFA desactivado"
  });

}

return (

<div
  style={{
    position: "fixed",
    inset: 0,
    background:
      "rgba(2,6,23,0.85)",
    backdropFilter: "blur(8px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999
  }}
>

<div
  className="card-pro"

  style={{
    width: "100%",
    maxWidth: "700px",
    padding: "30px",
    position: "relative"
  }}
>

<button

  onClick={onClose}

  style={{
    position: "absolute",
    right: "20px",
    top: "20px",

    background: "none",
    border: "none",

    color: "#fff",

    cursor: "pointer",

    fontSize: "22px"
  }}
>
  ✕
</button>

<h1
  style={{
    marginTop: 0,
    color: "#fff"
  }}
>
  🔐 Seguridad IT
</h1>

<p
  style={{
    color: "#94a3b8"
  }}
>
  {equipo?.nombreEquipo}
</p>

<div
  style={{
    display: "grid",
    gap: "14px",
    marginTop: "30px"
  }}
>

{alertas.length === 0 && (

<div
  style={{
    padding: "18px",
    borderRadius: "14px",
    background:
      "rgba(34,197,94,0.15)",

    color: "#22c55e",

    fontWeight: "700"
  }}
>
  ✅ Equipo totalmente seguro
</div>

)}

{alertas.map((a, index) => (

<div
  key={index}

  style={{
    padding: "18px",
    borderRadius: "14px",

    background:
      a.tipo === "critico"

      ? "rgba(239,68,68,0.15)"

      : "rgba(245,158,11,0.15)",

    color:
      a.tipo === "critico"

      ? "#ef4444"

      : "#f59e0b",

    fontWeight: "700"
  }}
>
  {
    a.tipo === "critico"
    ? "🔴"
    : "⚠"
  }

  {" "}
  {a.mensaje}
</div>

))}

</div>

</div>

</div>

);

}

export default ModalSeguridadEquipo;