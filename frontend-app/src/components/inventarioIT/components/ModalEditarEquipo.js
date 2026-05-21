import { useState } from "react";

import { toast }
from "react-toastify";

function ModalEditarEquipo({

  equipo,

  onClose,

  recargarEquipos

}) {

const API =
  "https://ticket-pro-backend.onrender.com";

/* =========================
   STATES
========================= */

const [nombreEquipo,
  setNombreEquipo] =
  useState(
    equipo?.nombreEquipo || ""
  );

const [usuarioAsignado,
  setUsuarioAsignado] =
  useState(
    equipo?.usuarioAsignado || ""
  );

const [windows,
  setWindows] =
  useState(
    equipo?.windows || ""
  );

const [antivirus,
  setAntivirus] =
  useState(
    equipo?.antivirus || ""
  );

const [mfa,
  setMfa] =
  useState(
    equipo?.mfa ?? true
  );

/* =========================
   PASSWORD WINDOWS
========================= */

const [passwordWindows,
  setPasswordWindows] =
  useState("");

const [
  confirmarPasswordWindows,

  setConfirmarPasswordWindows
] = useState("");

const [
  passwordWindowsDesconocido,

  setPasswordWindowsDesconocido
] = useState(
  equipo?.passwordWindowsDesconocido || false
);

const [
  fechaCambioPasswordWindows,

  setFechaCambioPasswordWindows
] = useState(
  equipo?.fechaCambioPasswordWindows
  ? equipo.fechaCambioPasswordWindows
      .split("T")[0]
  : ""
);

const [
  fechaExpiracionPasswordWindows,

  setFechaExpiracionPasswordWindows
] = useState(
  equipo?.fechaExpiracionPasswordWindows
  ? equipo.fechaExpiracionPasswordWindows
      .split("T")[0]
  : ""
);

/* =========================
   PASSWORD ERP
========================= */

const [passwordERP,
  setPasswordERP] =
  useState("");

const [
  confirmarPasswordERP,

  setConfirmarPasswordERP
] = useState("");

const [
  passwordERPNoAplica,

  setPasswordERPNoAplica
] = useState(
  equipo?.passwordERPNoAplica || false
);

const [
  fechaCambioPasswordERP,

  setFechaCambioPasswordERP
] = useState(
  equipo?.fechaCambioPasswordERP
  ? equipo.fechaCambioPasswordERP
      .split("T")[0]
  : ""
);

const [
  fechaExpiracionPasswordERP,

  setFechaExpiracionPasswordERP
] = useState(
  equipo?.fechaExpiracionPasswordERP
  ? equipo.fechaExpiracionPasswordERP
      .split("T")[0]
  : ""
);

/* =========================
   ANTIVIRUS
========================= */

const [
  fechaExpiracionAntivirus,

  setFechaExpiracionAntivirus
] = useState(
  equipo?.fechaExpiracionAntivirus
  ? equipo.fechaExpiracionAntivirus
      .split("T")[0]
  : ""
);

/* =========================
   VALIDACIONES
========================= */

const windowsCoincide =

  passwordWindows ===
  confirmarPasswordWindows;

const erpCoincide =

  passwordERP ===
  confirmarPasswordERP;

/* =========================
   GUARDAR
========================= */

const guardarCambios =
  async () => {

  try {

    /* WINDOWS */

    if (
      !passwordWindowsDesconocido &&
      passwordWindows &&
      !windowsCoincide
    ) {

      toast.error(
        "Passwords Windows no coinciden"
      );

      return;
    }

    /* ERP */

    if (
      !passwordERPNoAplica &&
      passwordERP &&
      !erpCoincide
    ) {

      toast.error(
        "Passwords ERP no coinciden"
      );

      return;
    }

    const body = {

      nombreEquipo,

      usuarioAsignado,

      windows,

      antivirus,

      mfa,

      passwordWindows:
        passwordWindows ||
        equipo.passwordWindows,

      passwordWindowsDesconocido,

      fechaCambioPasswordWindows,

      fechaExpiracionPasswordWindows,

      passwordERP:
        passwordERP ||
        equipo.passwordERP,

      passwordERPNoAplica,

      fechaCambioPasswordERP,

      fechaExpiracionPasswordERP,

      fechaExpiracionAntivirus

    };

    const res = await fetch(

      `${API}/it/equipos/${equipo._id}`,

      {

        method: "PUT",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify(body)
      }
    );

    if (!res.ok) {

      throw new Error(
        "Error actualizando"
      );
    }

    toast.success(
      "Equipo actualizado"
    );

    recargarEquipos();

    onClose();

  } catch (err) {

    console.log(err);

    toast.error(
      "Error actualizando equipo"
    );
  }
};

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

    padding: "20px",

    overflowY: "auto"
  }}
>

<div
  className="card-pro"

  style={{

    width: "100%",

    maxWidth: "850px",

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

<h1
  style={{
    color: "#fff",
    marginTop: 0,
    marginBottom: "30px"
  }}
>
  ✏ Editar Equipo
</h1>

<div
  style={{
    display: "grid",
    gap: "20px"
  }}
>

{/* NOMBRE */}

<div>

<label className="label-pro">
  Nombre Equipo
</label>

<input
  className="input-pro"

  value={nombreEquipo}

  onChange={(e) =>
    setNombreEquipo(
      e.target.value
    )
  }
/>

</div>

{/* USUARIO */}

<div>

<label className="label-pro">
  Usuario Asignado
</label>

<input
  className="input-pro"

  value={usuarioAsignado}

  onChange={(e) =>
    setUsuarioAsignado(
      e.target.value
    )
  }
/>

</div>

{/* WINDOWS */}

<div>

<label className="label-pro">
  Sistema Operativo
</label>

<select
  className="input-pro"

  value={windows}

  onChange={(e) =>
    setWindows(
      e.target.value
    )
  }
>

<option>
  Windows 11 Pro
</option>

<option>
  Windows 10 Pro
</option>

<option>
  Windows 11 Home
</option>

<option>
  Windows 10 Home
</option>

<option>
  Windows Server 2022
</option>

<option>
  Windows Server 2019
</option>

<option>
  macOS
</option>

<option>
  Linux Ubuntu
</option>

</select>

</div>

{/* MFA */}

<div>

<label className="label-pro">
  MFA
</label>

<select
  className="input-pro"

  value={mfa ? "si" : "no"}

  onChange={(e) =>
    setMfa(
      e.target.value === "si"
    )
  }
>

<option value="si">
  MFA Activado
</option>

<option value="no">
  MFA Desactivado
</option>

</select>

</div>

{/* PASSWORD WINDOWS */}

<div
  style={{
    padding: "20px",
    borderRadius: "18px",
    background:
      "rgba(15,23,42,0.55)"
  }}
>

<h3 style={{ color: "#fff" }}>
  🔐 Password Windows
</h3>

<div
  style={{
    display: "grid",
    gap: "16px"
  }}
>

<input
  type="password"
  className="input-pro"
  placeholder="Nueva password Windows"

  disabled={
    passwordWindowsDesconocido
  }

  value={passwordWindows}

  onChange={(e) =>
    setPasswordWindows(
      e.target.value
    )
  }
/>

<input
  type="password"
  className="input-pro"
  placeholder="Confirmar password Windows"

  disabled={
    passwordWindowsDesconocido
  }

  value={
    confirmarPasswordWindows
  }

  onChange={(e) =>
    setConfirmarPasswordWindows(
      e.target.value
    )
  }
/>

{passwordWindows && (

<div
  style={{
    color:
      windowsCoincide
      ? "#22c55e"
      : "#ef4444",

    fontWeight: 600
  }}
>

{windowsCoincide
  ? "✅ Passwords Windows coinciden"
  : "❌ Passwords Windows no coinciden"}

</div>

)}

<label
  style={{
    color: "#94a3b8"
  }}
>

<input
  type="checkbox"

  checked={
    passwordWindowsDesconocido
  }

  onChange={(e) =>
    setPasswordWindowsDesconocido(
      e.target.checked
    )
  }

  style={{
    marginRight: "8px"
  }}
/>

Password desconocido

</label>

<div>

<label className="label-pro">
  Último cambio password Windows
</label>

<input
  type="date"

  disabled={
    passwordWindowsDesconocido
  }

  className="input-pro"

  value={
    fechaCambioPasswordWindows
  }

  onChange={(e) =>
    setFechaCambioPasswordWindows(
      e.target.value
    )
  }
/>

</div>

<div>

<label className="label-pro">
  Próximo cambio password Windows
</label>

<input
  type="date"

  disabled={
    passwordWindowsDesconocido
  }

  className="input-pro"

  value={
    fechaExpiracionPasswordWindows
  }

  onChange={(e) =>
    setFechaExpiracionPasswordWindows(
      e.target.value
    )
  }
/>

</div>

</div>

</div>

{/* PASSWORD ERP */}

<div
  style={{
    padding: "20px",
    borderRadius: "18px",
    background:
      "rgba(15,23,42,0.55)"
  }}
>

<h3 style={{ color: "#fff" }}>
  🏢 Password ERP
</h3>

<div
  style={{
    display: "grid",
    gap: "16px"
  }}
>

<input
  type="password"
  className="input-pro"
  placeholder="Nueva password ERP"

  disabled={
    passwordERPNoAplica
  }

  value={passwordERP}

  onChange={(e) =>
    setPasswordERP(
      e.target.value
    )
  }
/>

<input
  type="password"
  className="input-pro"
  placeholder="Confirmar password ERP"

  disabled={
    passwordERPNoAplica
  }

  value={
    confirmarPasswordERP
  }

  onChange={(e) =>
    setConfirmarPasswordERP(
      e.target.value
    )
  }
/>

{passwordERP && (

<div
  style={{
    color:
      erpCoincide
      ? "#22c55e"
      : "#ef4444",

    fontWeight: 600
  }}
>

{erpCoincide
  ? "✅ Passwords ERP coinciden"
  : "❌ Passwords ERP no coinciden"}

</div>

)}

<label
  style={{
    color: "#94a3b8"
  }}
>

<input
  type="checkbox"

  checked={
    passwordERPNoAplica
  }

  onChange={(e) =>
    setPasswordERPNoAplica(
      e.target.checked
    )
  }

  style={{
    marginRight: "8px"
  }}
/>

ERP no aplica

</label>

<div>

<label className="label-pro">
  Último cambio password ERP
</label>

<input
  type="date"

  disabled={
    passwordERPNoAplica
  }

  className="input-pro"

  value={
    fechaCambioPasswordERP
  }

  onChange={(e) =>
    setFechaCambioPasswordERP(
      e.target.value
    )
  }
/>

</div>

<div>

<label className="label-pro">
  Próximo cambio password ERP
</label>

<input
  type="date"

  disabled={
    passwordERPNoAplica
  }

  className="input-pro"

  value={
    fechaExpiracionPasswordERP
  }

  onChange={(e) =>
    setFechaExpiracionPasswordERP(
      e.target.value
    )
  }
/>

</div>

</div>

</div>

{/* ANTIVIRUS */}

<div>

<label className="label-pro">
  Antivirus
</label>

<select
  className="input-pro"

  value={antivirus}

  onChange={(e) =>
    setAntivirus(
      e.target.value
    )
  }
>

<option value="">
  Seleccionar antivirus
</option>

<option>
  Microsoft Defender
</option>

<option>
  ESET Endpoint
</option>

<option>
  Bitdefender
</option>

<option>
  Kaspersky
</option>

<option>
  Sophos
</option>

<option>
  CrowdStrike
</option>

<option>
  SentinelOne
</option>

<option>
  Otro
</option>

</select>

</div>

{antivirus !== "Microsoft Defender" &&
antivirus !== "" && (

<div>

<label className="label-pro">
  Fecha expiración antivirus
</label>

<input
  type="date"
  className="input-pro"

  value={
    fechaExpiracionAntivirus
  }

  onChange={(e) =>
    setFechaExpiracionAntivirus(
      e.target.value
    )
  }
/>

</div>

)}

{/* BOTON */}

<button
  className="btn-pro"

  onClick={guardarCambios}
>
  💾 Guardar Cambios
</button>

</div>

</div>

</div>

);

}

export default ModalEditarEquipo;