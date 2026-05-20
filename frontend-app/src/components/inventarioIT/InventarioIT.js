import { useEffect, useState } from "react";
import ModalResolverSeguridad
from "./components/ModalResolverSeguridad";
import NuevoEquipo from "./views/NuevoEquipo";
import ListaEquipos from "./views/ListaEquipos";
function InventarioIT() {

const [vista, setVista] =
  useState("nuevo");
const API =
  "https://ticket-pro-backend.onrender.com";

const [equipos, setEquipos] =
  useState([]);
const [openResolver,
  setOpenResolver] =
  useState(false);

const [equipoResolver,
  setEquipoResolver] =
  useState(null);
const obtenerEquipos =
  async () => {

  try {

    const res = await fetch(
      `${API}/it/equipos`
    );

    const data =
      await res.json();

    setEquipos(data);

  } catch (err) {

    console.log(err);

  }

};
useEffect(() => {

  obtenerEquipos();

}, []);

const totalEquipos =
  equipos.length;

const totalAlertas =
  equipos.filter((e) => {

    const hoy = new Date();

    const fechaAntivirus =
      new Date(
        e.fechaExpiracionAntivirus
      );

   const fechaPassword =
  new Date(
    e.fechaExpiracionPasswordWindows
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
  fechaPassword - hoy
) /
        (1000 * 60 * 60 * 24)
      );

    return (

      diasAntivirus <=
        e.diasAlertaAntivirus ||

diasPassword <=
  e.diasRecordatorioPassword ||

      !e.mfa

    );

  }).length;

return (

<div className="main-pro">

{/* HERO */}

<div
  className="card-pro"

  style={{
    padding: "35px",

    marginBottom: "30px",

    background:
      "linear-gradient(145deg, rgba(37,99,235,0.18), rgba(124,58,237,0.14))",

    border:
      "1px solid rgba(59,130,246,0.18)"
  }}
>

<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px"
  }}
>

<div>

<h1
  className="ciclico-title"

  style={{
    marginBottom: "10px"
  }}
>
  💻 Inventario IT
</h1>

<p
  style={{
    color: "#94a3b8",
    maxWidth: "700px",
    lineHeight: "1.6",
    marginBottom: 0
  }}
>
  Administración corporativa de equipos,
  seguridad, hardware y activos tecnológicos.
</p>

</div>

{/* KPIs */}

<div
  style={{
    display: "flex",
    gap: "14px",
    flexWrap: "wrap"
  }}
>

<div
  style={{
    padding: "16px 20px",

    borderRadius: "18px",

    background:
      "rgba(15,23,42,0.55)",

    border:
      "1px solid rgba(51,65,85,0.7)",

    minWidth: "120px"
  }}
>

<div
  style={{
    color: "#64748b",
    fontSize: "13px"
  }}
>
  Equipos
</div>

<div
  style={{
    color: "#fff",
    fontSize: "28px",
    fontWeight: "700"
  }}
>
  {totalEquipos}
</div>

</div>

<div
  style={{
    padding: "16px 20px",

    borderRadius: "18px",

    background:
      "rgba(15,23,42,0.55)",

    border:
      "1px solid rgba(51,65,85,0.7)",

    minWidth: "120px"
  }}
>

<div
  style={{
    color: "#64748b",
    fontSize: "13px"
  }}
>
  Alertas
</div>

<div
  style={{
    color: "#f59e0b",
    fontSize: "28px",
    fontWeight: "700"
  }}
>
  {totalAlertas}
</div>

</div>

</div>

</div>

</div>

{/* NAV */}

<div
  style={{
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "30px"
  }}
>

<button
  className={
    vista === "dashboard"

    ? "btn-pro"

    : "btn-pro btn-secondary"
  }

  onClick={() =>
    setVista("dashboard")
  }
>
  📊 Dashboard
</button>

<button
  className={
    vista === "equipos"

    ? "btn-pro"

    : "btn-pro btn-secondary"
  }

  onClick={() =>
    setVista("equipos")
  }
>

<button
  className={
    vista === "alertas"

    ? "btn-pro"

    : "btn-pro btn-secondary"
  }

  onClick={() =>
    setVista("alertas")
  }
>
  ⚠ Alertas
</button>

</div>

{/* VISTAS */}

{vista === "dashboard" && (

<div className="card-pro">

<h2>
  📊 Dashboard IT
</h2>

<p style={{ color: "#94a3b8" }}>
  Próximamente métricas y estadísticas.
</p>

</div>

)}

{vista === "equipos" && (
 <ListaEquipos

  recargarDashboard={
    obtenerEquipos
  }

  irNuevoEquipo={() =>
    setVista("nuevo")
  }

/>
)}


{vista === "nuevo" && (
  <NuevoEquipo

  volverEquipos={() =>
    setVista("equipos")
  }

  recargarEquipos={
    obtenerEquipos
  }

/>
)}

{vista === "alertas" && (

<div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "18px"
  }}
>

<h2
  style={{
    color: "#fff",
    marginTop: 0
  }}
>
  ⚠ Centro de Alertas IT
</h2>

{equipos.map((e) => {

  const hoy = new Date();

  const fechaAntivirus =
    new Date(
      e.fechaExpiracionAntivirus
    );

 const fechaPassword =
  new Date(
    e.fechaExpiracionPasswordWindows
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
  fechaPassword - hoy
) /
      (1000 * 60 * 60 * 24)
    );

  const alertas = [];

  // 🔴 ANTIVIRUS VENCIDO

  if (diasAntivirus <= 0) {

    alertas.push({
      color: "#ef4444",
      titulo:
        "Antivirus vencido",
      descripcion:
        "El equipo requiere renovación inmediata del antivirus."
    });

  }

  // 🟡 ANTIVIRUS POR VENCER

  else if (

    diasAntivirus <=
      e.diasAlertaAntivirus

  ) {

    alertas.push({
      color: "#f59e0b",
      titulo:
        "Licencia antivirus próxima a vencer",
      descripcion:
        `Faltan ${diasAntivirus} días para vencimiento.`
    });

  }

  // 🔴 PASSWORD VENCIDO

  if (diasPassword <= 0) {

    alertas.push({
      color: "#ef4444",
      titulo:
        "Password vencido",
      descripcion:
        "La contraseña expiró y requiere cambio inmediato."
    });

  }

  // 🟡 PASSWORD POR VENCER

  else if (

    diasPassword <=
      e.diasRecordatorioPassword

  ) {

    alertas.push({
      color: "#f59e0b",
      titulo:
        "Password próximo a vencer",
      descripcion:
        `La contraseña vence en ${diasPassword} días.`
    });

  }

  // 🔴 MFA

  if (!e.mfa) {

    alertas.push({
      color: "#ef4444",
      titulo:
        "MFA desactivado",
      descripcion:
        "El equipo no tiene autenticación multifactor."
    });

  }

  if (alertas.length === 0)
    return null;

  return (

<div
  key={e._id}

  className="card-pro"

  style={{
    padding: "24px",

    border:
      "1px solid rgba(51,65,85,0.7)"
  }}
>

<h2
  style={{
    color: "#fff",
    marginTop: 0
  }}
>
  💻 {e.nombreEquipo}
</h2>

<p
  style={{
    color: "#94a3b8"
  }}
>
  👤 {e.usuarioAsignado}
</p>

<div
  style={{
    display: "grid",
    gap: "14px",
    marginTop: "20px"
  }}
>

{alertas.map((a, index) => (

<div
  key={index}

  style={{
    padding: "18px",

    borderRadius: "16px",

    background:
      `${a.color}15`,

    border:
      `1px solid ${a.color}40`
  }}
>

<div
  style={{
    color: a.color,
    fontWeight: "700",
    fontSize: "16px"
  }}
>
  ⚠ {a.titulo}
</div>

<p
  style={{
    color: "#cbd5e1",
    marginBottom: 0,
    marginTop: "8px"
  }}
>
  {a.descripcion}
</p>

</div>

))}

</div>
<div
  style={{
    display: "flex",
    gap: "12px",
    marginTop: "24px",
    flexWrap: "wrap"
  }}
>

<button
  className="btn-pro btn-secondary"

  onClick={() => {

    setVista("equipos");

  }}
>
  👁 Ver Equipo
</button>

<button
  className="btn-pro"

  onClick={() => {

    setVista("equipos");

  }}
>
  ✏ Editar
</button>

<button
  className="btn-pro btn-secondary"

onClick={() => {

  setEquipoResolver(e);

  setOpenResolver(true);

}}
  style={{
    border:
      "1px solid rgba(34,197,94,0.4)",

    color: "#22c55e"
  }}
>
  ✅ Resolver
</button>

</div>
</div>

);

})}

</div>

)}
{openResolver && (

<ModalResolverSeguridad

  equipo={equipoResolver}

  onClose={() =>
    setOpenResolver(false)
  }

  recargarEquipos={
    obtenerEquipos
  }

/>

)}
</div>

);
}

export default InventarioIT;