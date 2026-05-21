import { useState } from "react";
import { toast } from "react-toastify";

function NuevoEquipo({

  volverEquipos,

  recargarEquipos

}) {

const API =
  "https://ticket-pro-backend.onrender.com";

/* =========================
   STATES
========================= */

const [tipoEquipo, setTipoEquipo] =
  useState("laptop");

const [cantidadMonitores,
  setCantidadMonitores] =
  useState(1);

const [nombreEquipo,
  setNombreEquipo] =
  useState("");

const [usuarioAsignado,
  setUsuarioAsignado] =
  useState("");

const [windows,
  setWindows] =
  useState("Windows 11 Pro");

const [antivirus,
  setAntivirus] =
  useState("");

/* =========================
   WINDOWS PASSWORD
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
] = useState(false);

const [
  fechaExpiracionPasswordWindows,
  setFechaExpiracionPasswordWindows
] = useState("");

/* =========================
   ERP PASSWORD
========================= */

const [passwordERP,
  setPasswordERP] =
  useState("");

const [
  confirmarPasswordERP,
  setConfirmarPasswordERP
] = useState("");

const [passwordERPNoAplica,
  setPasswordERPNoAplica] =
  useState(false);

const [
  fechaExpiracionPasswordERP,
  setFechaExpiracionPasswordERP
] = useState("");

/* =========================
   ANTIVIRUS
========================= */

const [
  fechaExpiracionAntivirus,
  setFechaExpiracionAntivirus
] = useState("");

const [diasAlertaAntivirus] =
  useState(4);

const [estadoAntivirus,
  setEstadoAntivirus] =
  useState("activo");

/* =========================
   SEGURIDAD
========================= */

const [mfa, setMfa] =
  useState(true);

const [observaciones,
  setObservaciones] =
  useState("");

/* =========================
   MONITORES
========================= */

const [monitores,
  setMonitores] =
  useState([
    {
      marca: "",
      modelo: "",
      serie: "",
      tipoMonitor: "empresa"
    }
  ]);

/* =========================
   VALIDACIONES
========================= */

const windowsPasswordsCoinciden =

  passwordWindows ===
  confirmarPasswordWindows;

const erpPasswordsCoinciden =

  passwordERP ===
  confirmarPasswordERP;

/* =========================
   GUARDAR
========================= */

const guardarEquipo =
  async () => {

  try {

    /* =========================
       VALIDACIONES
    ========================= */

    if (!nombreEquipo) {

      toast.error(
        "Nombre equipo requerido"
      );

      return;
    }

    if (!usuarioAsignado) {

      toast.error(
        "Usuario asignado requerido"
      );

      return;
    }

    /* WINDOWS */

    if (

      !passwordWindowsDesconocido &&

      !passwordWindows

    ) {

      toast.error(
        "Password Windows requerida"
      );

      return;
    }

    if (

      !passwordWindowsDesconocido &&

      !windowsPasswordsCoinciden

    ) {

      toast.error(
        "Passwords Windows no coinciden"
      );

      return;
    }

    if (

      !passwordWindowsDesconocido &&

      !fechaExpiracionPasswordWindows

    ) {

      toast.error(
        "Fecha expiración Windows requerida"
      );

      return;
    }

    /* ERP */

    if (

      !passwordERPNoAplica &&

      !passwordERP

    ) {

      toast.error(
        "Password ERP requerida"
      );

      return;
    }

    if (

      !passwordERPNoAplica &&

      !erpPasswordsCoinciden

    ) {

      toast.error(
        "Passwords ERP no coinciden"
      );

      return;
    }

    if (

      !passwordERPNoAplica &&

      !fechaExpiracionPasswordERP

    ) {

      toast.error(
        "Fecha expiración ERP requerida"
      );

      return;
    }

    /* ANTIVIRUS */

    if (

      antivirus !==
        "Microsoft Defender" &&

      antivirus !== "" &&

      !fechaExpiracionAntivirus

    ) {

      toast.error(
        "Fecha expiración antivirus requerida"
      );

      return;
    }

    /* =========================
       BODY
    ========================= */

    const body = {

      nombreEquipo,

      usuarioAsignado,

      tipoEquipo,

      windows,

      antivirus,

      passwordWindows,

      confirmarPasswordWindows,

      passwordWindowsDesconocido,

      fechaExpiracionPasswordWindows,

      passwordERP,

      confirmarPasswordERP,

      passwordERPNoAplica,

      fechaExpiracionPasswordERP,

      fechaExpiracionAntivirus,

      diasAlertaAntivirus,

      estadoAntivirus,

      mfa,

      observaciones,

      monitores:
        tipoEquipo === "desktop"
        ? monitores
        : []

    };

    const res = await fetch(

      `${API}/it/equipos`,

      {

        method: "POST",

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
        "Error guardando"
      );

    }

    toast.success(
      "Equipo registrado correctamente"
    );

    recargarEquipos();

    volverEquipos();

  } catch (err) {

    console.log(err);

    toast.error(
      "Error guardando equipo"
    );
  }
};

/* =========================
   JSX
========================= */

return (

<div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "28px"
  }}
>

{/* HERO */}

<div
  className="card-pro"
  style={{
    padding: "35px",
    background:
      "linear-gradient(145deg, rgba(37,99,235,0.18), rgba(124,58,237,0.14))",
    border:
      "1px solid rgba(59,130,246,0.18)"
  }}
>

<h1
  style={{
    margin: 0,
    fontSize: "38px",
    color: "#fff"
  }}
>
  💻 Nuevo Equipo IT
</h1>

<p
  style={{
    marginTop: "10px",
    color: "#94a3b8"
  }}
>
  Registro corporativo de activos tecnológicos
</p>

</div>

{/* GRID */}

<div
  style={{
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: "24px"
  }}
>

{/* IZQUIERDA */}

<div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  }}
>

{/* DATOS */}

<div
  className="card-pro"
  style={{
    padding: "28px"
  }}
>

<h2
  style={{
    color: "#fff",
    marginTop: 0
  }}
>
  Datos Generales
</h2>

<div
  style={{
    display: "grid",
    gap: "20px"
  }}
>

<input
  className="input-pro"
  placeholder="Nombre equipo"
  value={nombreEquipo}
  onChange={(e) =>
    setNombreEquipo(
      e.target.value
    )
  }
/>

<input
  className="input-pro"
  placeholder="Usuario asignado"
  value={usuarioAsignado}
  onChange={(e) =>
    setUsuarioAsignado(
      e.target.value
    )
  }
/>

<select
  className="input-pro"
  value={tipoEquipo}
  onChange={(e) =>
    setTipoEquipo(
      e.target.value
    )
  }
>

<option value="laptop">
  💻 Laptop
</option>

<option value="desktop">
  🖥 Desktop
</option>

</select>

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
  Windows 11 Home
</option>

<option>
  Windows 10 Pro
</option>

<option>
  Windows 10 Home
</option>

<option>
  Windows 8.1 Pro
</option>

<option>
  Windows 7 Pro
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

<option>
  Linux Mint
</option>

<option>
  Otro
</option>

</select>

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

</div>

{/* HARDWARE */}

{tipoEquipo === "desktop" && (

<div
  className="card-pro"
  style={{
    padding: "28px"
  }}
>

<h2
  style={{
    color: "#fff",
    marginTop: 0
  }}
>
  Hardware
</h2>

<div
  style={{
    display: "grid",
    gap: "20px"
  }}
>

<select
  className="input-pro"
  value={cantidadMonitores}
  onChange={(e) => {

    const cantidad =
      Number(e.target.value);

    setCantidadMonitores(
      cantidad
    );

    setMonitores(
      Array.from({
        length: cantidad
      }).map(() => ({
        marca: "",
        modelo: "",
        serie: "",
        tipoMonitor: "empresa"
      }))
    );
  }}
>

<option value={1}>1</option>
<option value={2}>2</option>
<option value={3}>3</option>

</select>

{monitores.map((monitor, index) => (

<div
  key={index}
  style={{
    padding: "20px",
    borderRadius: "18px",
    background:
      "rgba(15,23,42,0.55)"
  }}
>

<h3
  style={{
    color: "#fff"
  }}
>
  🖥 Monitor {index + 1}
</h3>

<div
  style={{
    display: "grid",
    gap: "14px"
  }}
>

<input
  className="input-pro"
  placeholder="Marca"
  value={monitor.marca}
  onChange={(e) => {

    const copia =
      [...monitores];

    copia[index]
      .marca =
      e.target.value;

    setMonitores(copia);
  }}
/>

<input
  className="input-pro"
  placeholder="Modelo"
  value={monitor.modelo}
  onChange={(e) => {

    const copia =
      [...monitores];

    copia[index]
      .modelo =
      e.target.value;

    setMonitores(copia);
  }}
/>

<input
  className="input-pro"
  placeholder="Serie"
  value={monitor.serie}
  onChange={(e) => {

    const copia =
      [...monitores];

    copia[index]
      .serie =
      e.target.value;

    setMonitores(copia);
  }}
/>

<select
  className="input-pro"
  value={monitor.tipoMonitor}
  onChange={(e) => {

    const copia =
      [...monitores];

    copia[index]
      .tipoMonitor =
      e.target.value;

    setMonitores(copia);
  }}
>

<option value="empresa">
  Empresa
</option>

<option value="prestado">
  Prestado empleado
</option>

</select>

</div>

</div>

))}

</div>

</div>

)}

</div>

{/* DERECHA */}

<div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  }}
>

<div
  className="card-pro"
  style={{
    padding: "28px"
  }}
>

<h2
  style={{
    color: "#fff",
    marginTop: 0
  }}
>
  Seguridad
</h2>

<div
  style={{
    display: "grid",
    gap: "20px"
  }}
>

{/* WINDOWS */}

<div>

<label className="label-pro">
  Password Windows
</label>

<input
  type="password"
  className="input-pro"
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

</div>

<input
  type="password"
  className="input-pro"
  placeholder="Confirmar Password Windows"
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

{!passwordWindowsDesconocido && (

<div
  style={{
    color:
      windowsPasswordsCoinciden
      ? "#22c55e"
      : "#ef4444",
    fontWeight: "700",
    fontSize: "14px"
  }}
>
  {
    windowsPasswordsCoinciden
    ? "✅ Passwords Windows coinciden"
    : "❌ Passwords Windows no coinciden"
  }
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

{/* ERP */}

<input
  type="password"
  className="input-pro"
  placeholder="Password ERP"
  disabled={passwordERPNoAplica}
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
  placeholder="Confirmar Password ERP"
  disabled={passwordERPNoAplica}
  value={
    confirmarPasswordERP
  }
  onChange={(e) =>
    setConfirmarPasswordERP(
      e.target.value
    )
  }
/>

{!passwordERPNoAplica && (

<div
  style={{
    color:
      erpPasswordsCoinciden
      ? "#22c55e"
      : "#ef4444",
    fontWeight: "700",
    fontSize: "14px"
  }}
>
  {
    erpPasswordsCoinciden
    ? "✅ Passwords ERP coinciden"
    : "❌ Passwords ERP no coinciden"
  }
</div>

)}

<label
  style={{
    color: "#94a3b8"
  }}
>

<input
  type="checkbox"
  checked={passwordERPNoAplica}
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

<input
  type="date"
  disabled={passwordERPNoAplica}
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

{/* MFA */}

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

{/* ANTIVIRUS */}

{antivirus !== "Microsoft Defender" &&
antivirus !== "" && (

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

)}

{antivirus === "Microsoft Defender" && (

<div
  style={{
    padding: "14px",
    borderRadius: "14px",
    background:
      "rgba(16,185,129,0.12)",
    color: "#6ee7b7"
  }}
>
  ✅ Microsoft Defender no requiere
  expiración.
</div>

)}

</div>

</div>

</div>

</div>

{/* OBSERVACIONES */}

<div
  className="card-pro"
  style={{
    padding: "28px"
  }}
>

<h2
  style={{
    color: "#fff",
    marginTop: 0
  }}
>
  Observaciones
</h2>

<textarea
  className="input-pro"
  rows={7}
  value={observaciones}
  onChange={(e) =>
    setObservaciones(
      e.target.value
    )
  }
  placeholder="Notas técnicas..."
/>

</div>

{/* BOTONES */}

<div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    gap: "14px"
  }}
>

<button
  className="btn-pro btn-secondary"
  onClick={volverEquipos}
>
  Cancelar
</button>

<button
  className="btn-pro"
  onClick={guardarEquipo}
>
  💾 Guardar Equipo
</button>

</div>

</div>

);

}

export default NuevoEquipo;