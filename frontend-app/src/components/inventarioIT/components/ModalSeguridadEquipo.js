function ModalSeguridadEquipo({

  equipo,

  onClose

}) {

if (!equipo) return null;

/* =========================
   HELPERS
========================= */

function diasRestantes(fecha) {

  if (!fecha) return null;

  const hoy =
    new Date();

  const vencimiento =
    new Date(fecha);

  hoy.setHours(0,0,0,0);

  vencimiento.setHours(0,0,0,0);

  const diff =
    vencimiento - hoy;

  return Math.ceil(
    diff / (1000 * 60 * 60 * 24)
  );

}

const diasAntivirus =
  diasRestantes(
    equipo?.fechaExpiracionAntivirus
  );

const diasPasswordWindows =
  diasRestantes(
    equipo?.fechaExpiracionPasswordWindows
  );

const diasPasswordERP =
  diasRestantes(
    equipo?.fechaExpiracionPasswordERP
  );

const alertas = [];

/* =========================
   MFA
========================= */

if (!equipo?.mfa) {

  alertas.push({

    tipo: "critico",

    icono: "🔴",

    titulo:
      "MFA desactivado",

    mensaje:
      "El equipo no cuenta con autenticación multifactor."

  });

}

/* =========================
   ANTIVIRUS
========================= */

if (
  equipo?.antivirus &&
  equipo.antivirus !==
    "Microsoft Defender"
) {

  if (
    diasAntivirus !== null
  ) {

    if (
      diasAntivirus < 0
    ) {

      alertas.push({

        tipo: "critico",

        icono: "🔴",

        titulo:
          "Antivirus vencido",

        mensaje:
          "La licencia del antivirus expiró y requiere renovación inmediata."

      });

    } else if (
      diasAntivirus <=
      (equipo?.diasAlertaAntivirus || 4)
    ) {

      alertas.push({

        tipo: "alerta",

        icono: "⚠",

        titulo:
          "Antivirus próximo a vencer",

        mensaje:
          `La licencia vence en ${diasAntivirus} días.`

      });

    }

  }

}

/* =========================
   PASSWORD WINDOWS
========================= */

if (
  !equipo?.passwordWindowsDesconocido &&
  diasPasswordWindows !== null
) {

  if (
    diasPasswordWindows < 0
  ) {

    alertas.push({

      tipo: "critico",

      icono: "🔴",

      titulo:
        "Password Windows vencido",

      mensaje:
        "La contraseña de Windows expiró."

    });

  } else if (
    diasPasswordWindows <= 4
  ) {

    alertas.push({

      tipo: "alerta",

      icono: "⚠",

      titulo:
        "Password Windows próximo a vencer",

      mensaje:
        `La contraseña vence en ${diasPasswordWindows} días.`

    });

  }

}

/* =========================
   PASSWORD ERP
========================= */

if (
  !equipo?.passwordERPNoAplica &&
  diasPasswordERP !== null
) {

  if (
    diasPasswordERP < 0
  ) {

    alertas.push({

      tipo: "critico",

      icono: "🔴",

      titulo:
        "Password ERP vencido",

      mensaje:
        "La contraseña del ERP expiró."

    });

  } else if (
    diasPasswordERP <= 4
  ) {

    alertas.push({

      tipo: "alerta",

      icono: "⚠",

      titulo:
        "Password ERP próximo a vencer",

      mensaje:
        `La contraseña ERP vence en ${diasPasswordERP} días.`

    });

  }

}

/* =========================
   ESTADO GENERAL
========================= */

const estadoColor =

  equipo?.estadoSeguridad ===
  "riesgo"

  ? "#ef4444"

  : equipo?.estadoSeguridad ===
    "alerta"

  ? "#f59e0b"

  : "#22c55e";

/* =========================
   JSX
========================= */

return (

<div
  style={{
    position: "fixed",

    inset: 0,

    background:
      "rgba(2,6,23,0.85)",

    backdropFilter:
      "blur(8px)",

    display: "flex",

    justifyContent:
      "center",

    alignItems: "center",

    zIndex: 9999,

    padding: "20px"
  }}
>

<div
  className="card-pro"

  style={{

    width: "100%",

    maxWidth: "760px",

    maxHeight: "90vh",

    overflowY: "auto",

    padding: "32px",

    position: "relative",

    background:
      "linear-gradient(145deg, rgba(15,23,42,0.96), rgba(15,23,42,0.88))",

    border:
      "1px solid rgba(51,65,85,0.8)"
  }}
>

{/* CERRAR */}

<button

  onClick={onClose}

  style={{

    position: "absolute",

    right: "20px",

    top: "20px",

    width: "42px",

    height: "42px",

    borderRadius: "12px",

    border: "none",

    background:
      "rgba(239,68,68,0.15)",

    color: "#ef4444",

    cursor: "pointer",

    fontSize: "18px"
  }}
>
  ✕
</button>

{/* HEADER */}

<div
  style={{
    marginBottom: "30px"
  }}
>

<h1
  style={{
    marginTop: 0,
    marginBottom: "10px",
    color: "#fff"
  }}
>
  🔐 Seguridad IT
</h1>

<p
  style={{
    color: "#94a3b8",
    marginBottom: 0
  }}
>
  {equipo?.nombreEquipo}
</p>

</div>

{/* STATUS */}

<div
  style={{

    padding: "20px",

    borderRadius: "18px",

    background:
      `${estadoColor}15`,

    border:
      `1px solid ${estadoColor}40`,

    marginBottom: "24px"
  }}
>

<div
  style={{
    color: estadoColor,
    fontWeight: "700",
    fontSize: "18px"
  }}
>
  Estado General:
  {" "}

  {equipo?.estadoSeguridad?.toUpperCase()}
</div>

</div>

{/* ALERTAS */}

<div
  style={{
    display: "grid",
    gap: "16px"
  }}
>

{alertas.length === 0 && (

<div
  style={{

    padding: "20px",

    borderRadius: "16px",

    background:
      "rgba(34,197,94,0.15)",

    border:
      "1px solid rgba(34,197,94,0.3)",

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

    padding: "20px",

    borderRadius: "16px",

    background:

      a.tipo === "critico"

      ? "rgba(239,68,68,0.15)"

      : "rgba(245,158,11,0.15)",

    border:

      a.tipo === "critico"

      ? "1px solid rgba(239,68,68,0.3)"

      : "1px solid rgba(245,158,11,0.3)"
  }}
>

<div
  style={{

    color:

      a.tipo === "critico"

      ? "#ef4444"

      : "#f59e0b",

    fontWeight: "700",

    fontSize: "17px",

    marginBottom: "10px"
  }}
>

  {a.icono}
  {" "}
  {a.titulo}

</div>

<div
  style={{
    color: "#cbd5e1",
    lineHeight: "1.6"
  }}
>

  {a.mensaje}

</div>

</div>

))}

</div>

{/* INFO EXTRA */}

<div
  style={{

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(240px,1fr))",

    gap: "16px",

    marginTop: "30px"
  }}
>

<div className="card-pro">

<h3
  style={{
    marginTop: 0
  }}
>
  🔐 MFA
</h3>

<p>
  {
    equipo?.mfa

    ? "✅ Activado"

    : "❌ Desactivado"
  }
</p>

</div>

<div className="card-pro">

<h3
  style={{
    marginTop: 0
  }}
>
  🛡 Antivirus
</h3>

<p>
  {
    equipo?.antivirus ||
    "No registrado"
  }
</p>

</div>

<div className="card-pro">

<h3
  style={{
    marginTop: 0
  }}
>
  📅 Expiración AV
</h3>

<p>

{
  equipo?.fechaExpiracionAntivirus

  ? new Date(
      equipo.fechaExpiracionAntivirus
    ).toLocaleDateString()

  : "No definida"
}

</p>

</div>

<div className="card-pro">

<h3
  style={{
    marginTop: 0
  }}
>
  🔑 Password Windows
</h3>

<p>

{
  equipo?.passwordWindowsDesconocido

  ? "Desconocido"

  : equipo?.fechaExpiracionPasswordWindows

  ? new Date(
      equipo.fechaExpiracionPasswordWindows
    ).toLocaleDateString()

  : "No definida"
}

</p>

</div>

</div>

</div>

</div>

);

}

export default ModalSeguridadEquipo;