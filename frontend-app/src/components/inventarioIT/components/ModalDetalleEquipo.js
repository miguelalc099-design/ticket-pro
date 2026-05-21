function ModalDetalleEquipo({

  equipo,

  onClose

}) {

if (!equipo) return null;

/* =========================
   HELPERS
========================= */

const formatearFecha =
  (fecha) => {

  if (!fecha)
    return "No definida";

  return new Date(
    fecha
  ).toLocaleDateString();
};

const diasRestantes =
  (fecha) => {

  if (!fecha)
    return null;

  const hoy =
    new Date();

  const vencimiento =
    new Date(fecha);

  hoy.setHours(0,0,0,0);

  vencimiento.setHours(0,0,0,0);

  return Math.ceil(
    (
      vencimiento - hoy
    ) /
    (1000 * 60 * 60 * 24)
  );
};

/* =========================
   ESTADO SEGURIDAD
========================= */

const colorEstado = {

  seguro: "#22c55e",

  alerta: "#f59e0b",

  riesgo: "#ef4444"
};

const estado =
  equipo.estadoSeguridad ||
  "seguro";

const color =
  colorEstado[estado];

/* =========================
   CALCULOS
========================= */

const diasWindows =
  diasRestantes(
    equipo.fechaExpiracionPasswordWindows
  );

const diasERP =
  diasRestantes(
    equipo.fechaExpiracionPasswordERP
  );

const diasAntivirus =
  diasRestantes(
    equipo.fechaExpiracionAntivirus
  );

const diasGarantia =
  diasRestantes(
    equipo.garantiaHasta
  );

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

    maxWidth: "1200px",

    maxHeight: "92vh",

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
  {
    equipo.tipoEquipo === "desktop"
    ? "🖥"
    : "💻"
  }
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

<div
  style={{
    marginTop: "10px",
    display: "flex",
    gap: "12px",
    flexWrap: "wrap"
  }}
>

<div
  style={{
    padding: "8px 14px",
    borderRadius: "12px",
    background: `${color}20`,
    color,
    fontWeight: "700"
  }}
>
  {estado.toUpperCase()}
</div>

<div
  style={{
    padding: "8px 14px",
    borderRadius: "12px",
    background:
      "rgba(59,130,246,0.15)",
    color: "#60a5fa"
  }}
>
  {equipo.windows}
</div>

</div>

</div>

</div>

{/* GRID */}

<div
  style={{

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(340px,1fr))",

    gap: "20px"
  }}
>

{/* HARDWARE */}

<div
  className="card-pro"

  style={{
    padding: "24px"
  }}
>

<h2
  style={{
    marginTop: 0,
    color: "#fff"
  }}
>
  🖥 Hardware
</h2>

<div
  style={{
    display: "grid",
    gap: "14px"
  }}
>

<div>
  <b>Marca:</b>
  {" "}
  {equipo.marca || "N/A"}
</div>

<div>
  <b>Modelo:</b>
  {" "}
  {equipo.modelo || "N/A"}
</div>

<div>
  <b>Número Serie:</b>
  {" "}
  {equipo.numeroSerie || "N/A"}
</div>

<div>
  <b>Procesador:</b>
  {" "}
  {equipo.procesador || "N/A"}
</div>

<div>
  <b>RAM:</b>
  {" "}
  {equipo.ram || "N/A"}
</div>

<div>
  <b>Tarjeta gráfica:</b>
  {" "}
  {equipo.tarjetaGrafica || "N/A"}
</div>

<div>
  <b>Almacenamiento:</b>
  {" "}
  {equipo.almacenamiento || "N/A"}
</div>

<div>
  <b>Tipo sistema:</b>
  {" "}
  {equipo.tipoSistema || "N/A"}
</div>

</div>

</div>

{/* ACTIVOS */}

<div
  className="card-pro"

  style={{
    padding: "24px"
  }}
>

<h2
  style={{
    marginTop: 0,
    color: "#fff"
  }}
>
  🏷 Activos / Compra
</h2>

<div
  style={{
    display: "grid",
    gap: "14px"
  }}
>

<div>
  <b>Número activo:</b>
  {" "}
  {equipo.numeroActivo || "N/A"}
</div>

<div>
  <b>Proveedor:</b>
  {" "}
  {equipo.proveedor || "N/A"}
</div>

<div>
  <b>Factura:</b>
  {" "}
  {equipo.factura || "N/A"}
</div>

<div>
  <b>Fecha compra:</b>
  {" "}
  {formatearFecha(
    equipo.fechaCompra
  )}
</div>

<div>
  <b>Garantía hasta:</b>
  {" "}
  {formatearFecha(
    equipo.garantiaHasta
  )}
</div>

{diasGarantia !== null && (

<div>

⏳ Garantía:

{" "}

<span
style={{
  color:
    diasGarantia !== null &&
    diasGarantia <= 30
      ? "#ef4444"
      : "#22c55e"
}}
>

{
  diasGarantia < 0

  ? "Vencida"

  : `${diasGarantia} días restantes`
}

</span>

</div>

)}

</div>

</div>

{/* SEGURIDAD */}

<div
  className="card-pro"

  style={{

    padding: "24px",

    border:
      `1px solid ${color}40`
  }}
>

<h2
  style={{
    marginTop: 0,
    color
  }}
>
  🛡 Seguridad IT
</h2>
<div>
  🖥 Tipo:
  {" "}
  {equipo.tipoEquipo}
</div>

<div>
  🏷 Serie:
  {" "}
  {equipo.numeroSerie || "N/A"}
</div>
<div
  style={{
    display: "grid",
    gap: "14px"
  }}
>

<div>

<b>Estado:</b>
{" "}

<span
  style={{
    color,
    fontWeight: "700",
    textTransform: "uppercase"
  }}
>
  {estado}
</span>

</div>

<div>
  🔐 MFA:
  {" "}

  {
    equipo.mfa
    ? "✅ Activado"
    : "❌ Desactivado"
  }
</div>

<div>
  🛡 Antivirus:
  {" "}

  {
  equipo.antivirus ||
  "❌ Sin antivirus"
}

</div>

<div>
  📅 Expiración Antivirus:
  {" "}

  {
    formatearFecha(
      equipo.fechaExpiracionAntivirus
    )
  }
</div>

{diasAntivirus !== null && (

<div>

⏳ Antivirus:

{" "}

<span
  style={{
    color:
      diasAntivirus <= 4
      ? "#ef4444"
      : "#22c55e"
  }}
>

{
  diasAntivirus < 0

  ? "Vencido"

  : `${diasAntivirus} días restantes`
}

</span>

</div>

)}

</div>

</div>

{/* ALERTAS */}

<div
  className="card-pro"

  style={{
    padding: "24px"
  }}
>

<h2
  style={{
    marginTop: 0,
    color: "#fff"
  }}
>
  🚨 Alertas
</h2>

{
  !equipo.alertas ||
  equipo.alertas.length === 0
  ? (

<div
  style={{
    color: "#22c55e"
  }}
>
  ✅ Sin alertas activas
</div>

)

: (

<div
  style={{
    display: "grid",
    gap: "12px"
  }}
>

{equipo.alertas.map(
  (alerta, index) => (

<div
  key={index}

  style={{
    padding: "14px",
    borderRadius: "14px",

    background:
      "rgba(239,68,68,0.12)",

    color: "#fca5a5"
  }}
>

⚠ {alerta}

</div>

))
}

</div>

)}

</div>

{/* WINDOWS */}

<div
  className="card-pro"

  style={{
    padding: "24px"
  }}
>

<h2
  style={{
    marginTop: 0,
    color: "#fff"
  }}
>
  🔐 Windows
</h2>

<div
  style={{
    display: "grid",
    gap: "14px"
  }}
>

<div>
  <b>Password:</b>
  {" "}

{
  equipo.passwordWindowsDesconocido

  ? "❌ Desconocido"

  : !equipo.passwordWindows

  ? "❌ Sin password"

  : "✅ Configurado"
}

</div>

<div>
  <b>Último cambio:</b>
  {" "}

{
  formatearFecha(
    equipo.fechaCambioPasswordWindows
  )
}

</div>

<div>
  <b>Próximo cambio:</b>
  {" "}

{
  formatearFecha(
    equipo.fechaExpiracionPasswordWindows
  )
}

</div>

{diasWindows !== null && (

<div>

⏳ Password Windows:

{" "}

<span
  style={{
    color:
      diasWindows <= 4
      ? "#ef4444"
      : "#22c55e"
  }}
>

{
  diasWindows < 0

  ? "Vencido"

  : `${diasWindows} días restantes`
}

</span>

</div>

)}

</div>

</div>

{/* ERP */}

<div
  className="card-pro"

  style={{
    padding: "24px"
  }}
>

<h2
  style={{
    marginTop: 0,
    color: "#fff"
  }}
>
  🏢 ERP / Correo
</h2>

<div
  style={{
    display: "grid",
    gap: "14px"
  }}
>

<div>

<b>ERP:</b>

{" "}

{
  equipo.passwordERPNoAplica

  ? "No aplica"

  : !equipo.passwordERP

  ? "❌ Sin password"

  : "✅ Configurado"
}

</div>

{
!equipo.passwordERPNoAplica && (

<>

<div>
  <b>Último cambio:</b>
  {" "}

{
  formatearFecha(
    equipo.fechaCambioPasswordERP
  )
}

</div>

<div>
  <b>Próximo cambio:</b>
  {" "}

{
  formatearFecha(
    equipo.fechaExpiracionPasswordERP
  )
}

</div>

{diasERP !== null && (

<div>

⏳ Password ERP:

{" "}

<span
  style={{
    color:
      diasERP <= 4
      ? "#ef4444"
      : "#22c55e"
  }}
>

{
  diasERP < 0

  ? "Vencido"

  : `${diasERP} días restantes`
}

</span>

</div>

)}

</>

)}

</div>

</div>

{/* MONITORES */}

<div
  className="card-pro"

  style={{
    padding: "24px"
  }}
>

<h2
  style={{
    marginTop: 0,
    color: "#fff"
  }}
>
  🖥 Monitores
</h2>

{
!equipo.monitores ||
equipo.monitores.length === 0

? (

<div
  style={{
    color: "#94a3b8"
  }}
>
  No tiene monitores registrados
</div>

)

: (

<div
  style={{
    display: "grid",
    gap: "14px"
  }}
>

{equipo.monitores.map(
  (m, index) => (

<div
  key={index}

  style={{
    padding: "16px",
    borderRadius: "14px",

    background:
      "rgba(15,23,42,0.55)"
  }}
>

<div>
  <b>Marca:</b>
  {" "}
  {m.marca || "N/A"}
</div>

<div>
  <b>Modelo:</b>
  {" "}
  {m.modelo || "N/A"}
</div>

<div>
  <b>Serie:</b>
  {" "}
  {m.serie || "N/A"}
</div>

<div>
  <b>Tipo:</b>
  {" "}
  {m.tipoMonitor}
</div>

</div>

))
}

</div>

)}

</div>

</div>

{/* OBSERVACIONES */}

<div
  className="card-pro"

  style={{
    marginTop: "20px",
    padding: "24px"
  }}
>

<h2
  style={{
    marginTop: 0,
    color: "#fff"
  }}
>
  📝 Observaciones
</h2>

<p
  style={{
    color: "#cbd5e1",
    lineHeight: "1.7"
  }}
>
  {
    equipo.observaciones ||
    "Sin observaciones"
  }
</p>

</div>

</div>

</div>

);

}

export default ModalDetalleEquipo;