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
const colorEstado = {

  seguro: "#22c55e",

  alerta: "#f59e0b",

  riesgo: "#ef4444"

};
const hoy = new Date();

const fechaAntivirus =
  new Date(
    equipo?.fechaExpiracionAntivirus
  );

const fechaPassword =
  new Date(
    equipo?.fechaExpiracionPasswordWindows
  );

const diasRestantesAntivirus =
  Math.ceil(
    (
      fechaAntivirus - hoy
    ) /
    (1000 * 60 * 60 * 24)
  );

const diasPassword =
console.log(
  "PASSWORD DEBUG:",
  equipo.nombreEquipo,
  equipo.fechaExpiracionPasswordWindows,
  diasPassword
);
  Math.ceil(
    (
      fechaPassword - hoy
    ) /
    (1000 * 60 * 60 * 24)
  );

let estadoCalculado =
  "seguro";

if (
  diasRestantesAntivirus <= 0 ||
  diasPassword <= 0 ||
  !equipo?.mfa
) 
{

  estadoCalculado =
    "riesgo";

} else if (

  diasRestantesAntivirus <=
    equipo?.diasAlertaAntivirus ||

  diasPassword <=
  equipo?.diasRecordatorioPassword

) {

  estadoCalculado =
    "alerta";
}
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
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "6px"
  }}
>

{/* ESTADO GENERAL */}

<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",

    fontWeight: "700",

    color:
      colorEstado[
        estadoCalculado
      ]
  }}
>

<div>
  ●
</div>

<div
  style={{
    textTransform:
      "capitalize"
  }}
>
  {estadoCalculado}
</div>

</div>

{/* ALERTAS */}

{diasRestantesAntivirus <=
  equipo?.diasAlertaAntivirus &&

diasRestantesAntivirus > 0 && (

<div
  style={{
    color: "#f59e0b",
    fontSize: "14px"
  }}
>
  ⚠ Antivirus vence en{" "}
  {
    diasRestantesAntivirus
  } días
</div>

)}

{diasRestantesAntivirus <= 0 && (

<div
  style={{
    color: "#ef4444",
    fontSize: "14px",
    fontWeight: "700"
  }}
>
  🔴 Antivirus vencido
</div>

)}

{diasPassword <= 0 && (

<div
  style={{
    color: "#ef4444",
    fontSize: "14px",
    fontWeight: "700"
  }}
>
  🔴 Password vencido
</div>

)}

{diasPassword > 0 &&
 diasPassword <=
  equipo?.diasRecordatorioPassword && (

<div
  style={{
    color: "#f59e0b",
    fontSize: "14px"
  }}
>
  ⚠ Password vence en{" "}
  {diasPassword} días
</div>

)}
{!equipo?.mfa && (

<div
  style={{
    color: "#ef4444",
    fontSize: "14px",
    fontWeight: "700"
  }}
>
  🔴 MFA desactivado
</div>

)}

<div
  style={{
    color: "#94a3b8",
    fontSize: "13px"
  }}
>
  🛡 Seguridad IT Enterprise
</div>

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