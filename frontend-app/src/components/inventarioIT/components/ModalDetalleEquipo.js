function ModalDetalleEquipo({

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

const diasRestantesAntivirus =
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

let estadoCalculado =
  "seguro";

if (
  diasRestantesAntivirus <= 0 ||
  !equipo?.mfa
) {

  estadoCalculado =
    "riesgo";

} else if (

  diasRestantesAntivirus <=
    equipo?.diasAlertaAntivirus ||

  diasPassword >=
    equipo?.diasRecordatorioPassword

) {

  estadoCalculado =
    "alerta";
}

const colorEstado = {

  seguro: "#22c55e",

  alerta: "#f59e0b",

  riesgo: "#ef4444"
};

if (!equipo) return null;

return (

<div
  style={{

    position: "fixed",

    inset: 0,

    background:
      "rgba(2,6,23,0.82)",

    backdropFilter: "blur(8px)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    zIndex: 9999,

    padding: "20px"
  }}
>

<div
  className="card-pro"

  style={{

    width: "100%",

    maxWidth: "900px",

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

{/* BOTON CERRAR */}

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

    display: "flex",

    gap: "20px",

    alignItems: "center",

    marginBottom: "30px"
  }}
>

<div
  style={{

    width: "82px",

    height: "82px",

    borderRadius: "24px",

    background:
      equipo.tipoEquipo === "desktop"

      ? "linear-gradient(145deg,#2563eb,#7c3aed)"

      : "linear-gradient(145deg,#0f766e,#14b8a6)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "42px"
  }}
>
  {equipo.tipoEquipo === "desktop"
    ? "🖥"
    : "💻"}
</div>

<div>

<h1
  style={{
    margin: 0,
    color: "#fff",
    fontSize: "34px"
  }}
>
  {equipo.nombreEquipo}
</h1>

<p
  style={{
    color: "#94a3b8",
    marginTop: "8px",
    fontSize: "16px"
  }}
>
  👤 {equipo.usuarioAsignado}
</p>

</div>

</div>

{/* GRID */}

<div
  style={{

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(280px,1fr))",

    gap: "20px"
  }}
>
<div
  className="card-pro"

  style={{
    padding: "22px",
    marginTop: "20px",

    border:
      `1px solid ${
        colorEstado[
          estadoCalculado
        ]
      }40`
  }}
>

<h2
  style={{
    marginTop: 0,
    color:
      colorEstado[
        estadoCalculado
      ]
  }}
>
  🛡 Seguridad IT
</h2>

<div
  style={{
    display: "grid",
    gap: "14px",
    marginTop: "20px"
  }}
>

<div>
  Estado:
  {" "}

  <span
    style={{
      color:
        colorEstado[
          estadoCalculado
        ],

      fontWeight: "700"
    }}
  >
    {estadoCalculado}
  </span>
</div>

<div>
  🔐 MFA:
  {" "}

  {
    equipo?.mfa
    ? "✅ Activo"
    : "❌ Desactivado"
  }
</div>

<div>
  🛡 Antivirus:
  {" "}

  {
    equipo?.antivirus ||
    "No registrado"
  }
</div>

<div>
  📅 Expira:
  {" "}

  {
    equipo?.fechaExpiracionAntivirus
      ? new Date(
          equipo.fechaExpiracionAntivirus
        ).toLocaleDateString()
      : "No definida"
  }
</div>

<div>
  🔑 Último cambio password:
  {" "}

  {
    equipo?.fechaCambioPasswordWindows
      ? new Date(
          equipo.fechaCambioPasswordWindows
        ).toLocaleDateString()
      : "No definida"
  }
</div>

<div>
  📧 Correo corporativo:
  {" "}

  {
    equipo?.passwordERPNoAplica
      ? "No aplica"
      : "Configurado"
  }
</div>

</div>

</div>
{/* SISTEMA */}

<div className="card-pro">

<h3>🖥 Sistema</h3>

<p>
  <b>Windows:</b>
  {" "}
  {equipo.windows}
</p>

<p>
  <b>Tipo:</b>
  {" "}
  {equipo.tipoEquipo}
</p>

<p>
  <b>Antivirus:</b>
  {" "}
  {equipo.antivirus || "N/A"}
</p>

</div>

{/* SEGURIDAD */}

<div className="card-pro">

<h3>🔐 Seguridad</h3>

<p>
  <b>MFA:</b>
  {" "}
  {equipo.mfa
    ? "Activo"
    : "Desactivado"}
</p>

<p>
  <b>Estado Antivirus:</b>
  {" "}
  {equipo.estadoAntivirus}
</p>

<p>
  <b>Estado Seguridad:</b>
  {" "}

<span
  style={{
    color:
      colorEstado[
        estadoCalculado
      ]
  }}
>
  {estadoCalculado}
</span>

</p>

</div>

{/* PASSWORDS */}

<div className="card-pro">

<h3>🔑 Credenciales</h3>

<p>
  <b>Password Windows:</b>
  {" "}
  ••••••••
</p>

<p>
  <b>Password Correo:</b>
  {" "}
  ••••••••
</p>

</div>

{/* MONITORES */}

<div className="card-pro">

<h3>🖥 Monitores</h3>

{equipo.monitores?.length === 0 && (
  <p>No tiene monitores</p>
)}

{equipo.monitores?.map(
  (m, index) => (

<div
  key={index}

  style={{
    marginBottom: "12px"
  }}
>

<div>
  <b>ID:</b>
  {" "}
  {m.idMonitor || "N/A"}
</div>

<div>
  <b>Tipo:</b>
  {" "}
  {m.tipoMonitor}
</div>

</div>

))}

</div>

</div>

{/* OBSERVACIONES */}

<div
  className="card-pro"

  style={{
    marginTop: "20px"
  }}
>

<h3>📝 Observaciones</h3>

<p
  style={{
    color: "#cbd5e1",
    lineHeight: "1.7"
  }}
>
  {equipo.observaciones ||
    "Sin observaciones"}
</p>

</div>

</div>

</div>

);

}

export default ModalDetalleEquipo;