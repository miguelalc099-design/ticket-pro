function EquipoCard({

  equipo,

  nombreEquipo,

  usuarioAsignado,

  windows,

  antivirus,

  tipoEquipo,

  monitores,

  estadoSeguridad,

  onEditar,

  onVer,

  onSeguridad

}) {

/* =========================
   HELPERS
========================= */

const colorEstado = {

  seguro: "#22c55e",

  alerta: "#f59e0b",

  riesgo: "#ef4444"

};

const bgEstado = {

  seguro:
    "rgba(34,197,94,0.12)",

  alerta:
    "rgba(245,158,11,0.12)",

  riesgo:
    "rgba(239,68,68,0.12)"

};

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

const diasGarantia =
  diasRestantes(
    equipo?.garantiaHasta
  );

/* =========================
   ALERTAS
========================= */

const alertas = [];

/* MFA */

if (!equipo?.mfa) {

  alertas.push({
    color: "#ef4444",
    texto:
      "🔴 MFA desactivado"
  });

}
/* PASSWORD WINDOWS FALTANTE */

if (
  !equipo?.passwordWindowsDesconocido &&
  !equipo?.passwordWindows
) {

  alertas.push({
    color: "#ef4444",
    texto:
      "🔴 Equipo sin password Windows"
  });

}

/* PASSWORD WINDOWS DESCONOCIDO */

if (
  equipo?.passwordWindowsDesconocido
) {

  alertas.push({
    color: "#ef4444",
    texto:
      "🔴 Password Windows desconocido"
  });

}

/* ERP FALTANTE */

if (
  !equipo?.passwordERPNoAplica &&
  !equipo?.passwordERP
) {

  alertas.push({
    color: "#ef4444",
    texto:
      "🔴 ERP sin password"
  });

}

/* SIN ANTIVIRUS */

if (!equipo?.antivirus) {

  alertas.push({
    color: "#ef4444",
    texto:
      "🔴 Equipo sin antivirus"
  });

}
/* ANTIVIRUS */

if (

  antivirus &&

  antivirus !==
    "Microsoft Defender"

) {

  if (diasAntivirus < 0) {

    alertas.push({
      color: "#ef4444",
      texto:
        "🔴 Antivirus vencido"
    });

  }

  else if (

    diasAntivirus <= 4

  ) {

    alertas.push({
      color: "#f59e0b",
      texto:
        `⚠ Antivirus vence en ${diasAntivirus} días`
    });

  }

}

/* PASSWORD WINDOWS */

if (
  !equipo?.passwordWindowsDesconocido &&
  equipo?.fechaExpiracionPasswordWindows
) {

  if (
    diasPasswordWindows < 0
  ) {

    alertas.push({
      color: "#ef4444",
      texto:
        "🔴 Password Windows vencido"
    });

  }

  else if (
    diasPasswordWindows <= 4
  ) {

    alertas.push({
      color: "#f59e0b",
      texto:
        `⚠ Password Windows vence en ${diasPasswordWindows} días`
    });

  }

}

/* PASSWORD ERP */

if (
  !equipo?.passwordERPNoAplica &&
  equipo?.fechaExpiracionPasswordERP
) {

  if (
    diasPasswordERP < 0
  ) {

    alertas.push({
      color: "#ef4444",
      texto:
        "🔴 Password ERP vencido"
    });

  }

  else if (
    diasPasswordERP <= 4
  ) {

    alertas.push({
      color: "#f59e0b",
      texto:
        `⚠ Password ERP vence en ${diasPasswordERP} días`
    });

  }

}

/* GARANTIA */

if (
  equipo?.garantiaHasta
) {

  if (
    diasGarantia < 0
  ) {

    alertas.push({
      color: "#ef4444",
      texto:
        "🔴 Garantía vencida"
    });

  }

  else if (
    diasGarantia <= 30
  ) {

    alertas.push({
      color: "#f59e0b",
      texto:
        `⚠ Garantía vence en ${diasGarantia} días`
    });

  }

}

/* =========================
   ESTADO
========================= */

const estadoFinal =

  estadoSeguridad ||

  equipo?.estadoSeguridad ||

  "seguro";

/* =========================
   JSX
========================= */

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
      `1px solid ${colorEstado[estadoFinal]}35`
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

{/* ICONO */}

<div
  style={{

    width: "74px",

    height: "74px",

    borderRadius: "22px",

    background:

      tipoEquipo ===
      "desktop"

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

{
  tipoEquipo ===
  "desktop"

  ? "🖥"

  : "💻"
}

</div>

{/* INFO */}

<div
  style={{

    display: "flex",

    flexDirection: "column",

    gap: "14px",

    flex: 1
  }}
>

{/* TITULO */}

<div>

<h2
  style={{

    margin: 0,

    color: "#fff",

    fontSize: "25px"
  }}
>

  {nombreEquipo}

</h2>

<p
  style={{

    marginTop: "6px",

    marginBottom: 0,

    color: "#94a3b8"
  }}
>

  👤 {usuarioAsignado}

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

{/* WINDOWS */}

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

{/* ANTIVIRUS */}

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

{
  antivirus ||
  "⚠ Sin antivirus"
}

</div>

{/* TIPO */}

<div
  style={{

    background:
      "rgba(124,58,237,0.15)",

    color: "#c084fc",

    padding: "6px 12px",

    borderRadius: "999px",

    fontSize: "13px",

    fontWeight: "600",

    textTransform:
      "capitalize"
  }}
>

  {tipoEquipo}

</div>

{/* MONITORES */}

{
tipoEquipo ===
  "desktop" && (

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

  {
    monitores?.length || 0
  }
  {" "}
  Monitores

</div>

)}

{/* MFA */}

<div
  style={{

    background:

      equipo?.mfa

      ? "rgba(34,197,94,0.15)"

      : "rgba(239,68,68,0.15)",

    color:

      equipo?.mfa

      ? "#4ade80"

      : "#f87171",

    padding: "6px 12px",

    borderRadius: "999px",

    fontSize: "13px",

    fontWeight: "600"
  }}
>

{
  equipo?.mfa

  ? "MFA Activo"

  : "MFA OFF"
}

</div>

{/* NUMERO SERIE */}

{
equipo?.numeroSerie && (

<div
  style={{

    background:
      "rgba(148,163,184,0.15)",

    color: "#cbd5e1",

    padding: "6px 12px",

    borderRadius: "999px",

    fontSize: "13px",

    fontWeight: "600"
  }}
>

  SN:
  {" "}
  {equipo.numeroSerie}

</div>

)}

{/* GARANTIA */}

{
equipo?.garantiaHasta && (

<div
  style={{

    background:
      diasGarantia <= 30
      ? "rgba(239,68,68,0.15)"
      : "rgba(34,197,94,0.15)",

    color:
      diasGarantia <= 30
      ? "#f87171"
      : "#4ade80",

    padding: "6px 12px",

    borderRadius: "999px",

    fontSize: "13px",

    fontWeight: "600"
  }}
>

{
  diasGarantia < 0

  ? "Garantía vencida"

  : `Garantía ${diasGarantia} días`
}

</div>

)}

</div>

{/* STATUS */}

<div
  style={{

    display: "flex",

    flexDirection: "column",

    gap: "10px",

    marginTop: "6px"
  }}
>

{/* ESTADO */}

<div
  style={{

    display: "flex",

    alignItems: "center",

    gap: "10px",

    width: "fit-content",

    padding: "8px 14px",

    borderRadius: "999px",

    background:
      bgEstado[estadoFinal],

    color:
      colorEstado[
        estadoFinal
      ],

    fontWeight: "700",

    textTransform:
      "capitalize"
  }}
>

<div>
  ●
</div>

<div>
  {estadoFinal}
</div>

</div>

{/* ALERTAS */}

{
alertas.length === 0 && (

<div
  style={{

    color: "#22c55e",

    fontSize: "14px"
  }}
>

  ✅ Equipo seguro

</div>

)}

{
alertas.map(
  (alerta, index) => (

<div
  key={index}

  style={{

    color:
      alerta.color,

    fontSize: "14px",

    fontWeight: "600"
  }}
>

  {alerta.texto}

</div>

))
}

<div
  style={{

    color: "#64748b",

    fontSize: "13px",

    marginTop: "4px"
  }}
>

  🛡 Seguridad IT Enterprise

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

  onClick={onVer}
>
  👁 Ver
</button>

<button
  className="btn-pro btn-secondary"

  onClick={onSeguridad}
>
  🔐 Seguridad
</button>

<button
  className="btn-pro"

  onClick={onEditar}
>
  ✏ Editar
</button>

</div>

</div>

);

}

export default EquipoCard;