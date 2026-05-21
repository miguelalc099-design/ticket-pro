import { useEffect, useState } from "react";
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

const [passwordWindows,
  setPasswordWindows] =
  useState("");

const [
  passwordWindowsDesconocido,
  setPasswordWindowsDesconocido
] = useState(false);

const [passwordERP,
  setPasswordERP] =
  useState("");

const [passwordERPNoAplica,
  setPasswordERPNoAplica] =
  useState(false);

const [fechaExpiracionAntivirus,
  setFechaExpiracionAntivirus] =
  useState("");

const [diasAlertaAntivirus,
  setDiasAlertaAntivirus] =
  useState(30);

const [
  fechaCambioPasswordWindows,
  setFechaCambioPasswordWindows
] = useState("");

const [
  fechaExpiracionPasswordWindows,
  setFechaExpiracionPasswordWindows
] = useState("");

const [
  fechaCambioPasswordERP,
  setFechaCambioPasswordERP
] = useState("");

const [
  fechaExpiracionPasswordERP,
  setFechaExpiracionPasswordERP
] = useState("");

const [
  diasRecordatorioPassword,
  setDiasRecordatorioPassword
] = useState(5);

const [estadoAntivirus,
  setEstadoAntivirus] =
  useState("activo");

const [mfa, setMfa] =
  useState(true);

const [observaciones,
  setObservaciones] =
  useState("");

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
   EFFECTS
========================= */

useEffect(() => {

  if (!fechaCambioPasswordWindows)
    return;

  const fecha =
    new Date(
      fechaCambioPasswordWindows
    );

  fecha.setDate(
    fecha.getDate() +
    diasRecordatorioPassword
  );

  const yyyy =
    fecha.getFullYear();

  const mm =
    String(
      fecha.getMonth() + 1
    ).padStart(2, "0");

  const dd =
    String(
      fecha.getDate()
    ).padStart(2, "0");

  setFechaExpiracionPasswordWindows(
    `${yyyy}-${mm}-${dd}`
  );

}, [

  fechaCambioPasswordWindows,

  diasRecordatorioPassword

]);

useEffect(() => {

  if (!fechaCambioPasswordERP)
    return;

  const fecha =
    new Date(
      fechaCambioPasswordERP
    );

  fecha.setDate(
    fecha.getDate() +
    diasRecordatorioPassword
  );

  const yyyy =
    fecha.getFullYear();

  const mm =
    String(
      fecha.getMonth() + 1
    ).padStart(2, "0");

  const dd =
    String(
      fecha.getDate()
    ).padStart(2, "0");

  setFechaExpiracionPasswordERP(
    `${yyyy}-${mm}-${dd}`
  );

}, [

  fechaCambioPasswordERP,

  diasRecordatorioPassword

]);

/* =========================
   GUARDAR
========================= */

const guardarEquipo =
  async () => {

  try {

    const body = {

      nombreEquipo,

      usuarioAsignado,

      tipoEquipo,

      windows,

      antivirus,

      passwordWindows,

      passwordWindowsDesconocido,

      passwordERP,

      passwordERPNoAplica,

      fechaExpiracionAntivirus,

      diasAlertaAntivirus,

      fechaCambioPasswordWindows,

      fechaExpiracionPasswordWindows,

      fechaCambioPasswordERP,

      fechaExpiracionPasswordERP,

      diasRecordatorioPassword,

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

    const data =
      await res.json();

    console.log(data);

    toast.success(
      "Equipo registrado correctamente"
    );

    recargarEquipos();

    volverEquipos();

    /* RESET */

    setNombreEquipo("");

    setUsuarioAsignado("");

    setWindows(
      "Windows 11 Pro"
    );

    setAntivirus("");

    setPasswordWindows("");

    setPasswordWindowsDesconocido(
      false
    );

    setPasswordERP("");

    setPasswordERPNoAplica(
      false
    );

    setFechaExpiracionAntivirus(
      ""
    );

    setDiasAlertaAntivirus(
      30
    );

    setFechaCambioPasswordWindows(
      ""
    );

    setFechaExpiracionPasswordWindows(
      ""
    );

    setFechaCambioPasswordERP(
      ""
    );

    setFechaExpiracionPasswordERP(
      ""
    );

    setDiasRecordatorioPassword(
      5
    );

    setEstadoAntivirus(
      "activo"
    );

    setMfa(true);

    setObservaciones("");

    setTipoEquipo(
      "laptop"
    );

    setCantidadMonitores(1);

    setMonitores([
      {
        marca: "",
        modelo: "",
        serie: "",
        tipoMonitor: "empresa"
      }
    ]);

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
      "1px solid rgba(59,130,246,0.18)",
    position: "relative",
    overflow: "hidden"
  }}
>

<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "20px"
  }}
>

<div
  style={{
    width: "82px",
    height: "82px",
    borderRadius: "24px",
    background:
      "linear-gradient(145deg,#2563eb,#7c3aed)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "42px"
  }}
>
  💻
</div>

<div>

<h1
  style={{
    margin: 0,
    fontSize: "38px",
    color: "#fff"
  }}
>
  Nuevo Equipo IT
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

</div>

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
  Monitor {index + 1}
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

{/* SEGURIDAD */}

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

<input
  type="password"
  className="input-pro"
  placeholder="Password Windows"
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
  className="input-pro"
  value={fechaCambioPasswordWindows}
  onChange={(e) =>
    setFechaCambioPasswordWindows(
      e.target.value
    )
  }
/>

<input
  type="date"
  disabled
  className="input-pro"
  value={
    fechaExpiracionPasswordWindows
  }
/>

<input
  type="password"
  className="input-pro"
  placeholder="Password ERP"
  value={passwordERP}
  onChange={(e) =>
    setPasswordERP(
      e.target.value
    )
  }
/>

<label
  style={{
    color: "#94a3b8",
    fontSize: "14px"
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
  className="input-pro"
  value={fechaCambioPasswordERP}
  onChange={(e) =>
    setFechaCambioPasswordERP(
      e.target.value
    )
  }
/>

<input
  type="date"
  disabled
  className="input-pro"
  value={
    fechaExpiracionPasswordERP
  }
/>

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

{antivirus !== "Microsoft Defender" &&
antivirus !== "" && (

<>

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

<input
  type="number"
  className="input-pro"
  value={
    diasAlertaAntivirus
  }
  onChange={(e) =>
    setDiasAlertaAntivirus(
      Number(e.target.value)
    )
  }
/>

</>

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