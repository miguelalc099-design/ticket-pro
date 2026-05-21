import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function NuevoEquipo({

  volverEquipos,

  recargarEquipos

}) {

const API =
  "https://ticket-pro-backend.onrender.com";

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

const [passwordCorreo,
  setPasswordCorreo] =
  useState("");
const [passwordCorreoNoAplica,
  setPasswordCorreoNoAplica] =
  useState(false);

const [fechaExpiracionAntivirus,
  setFechaExpiracionAntivirus] =
  useState("");

const [diasAlertaAntivirus,
  setDiasAlertaAntivirus] =
  useState(30);

const [fechaCambioPasswordWindows,
  setFechaCambioPasswordWindows] =
  useState("");
const [

  fechaExpiracionPasswordWindows,

  setFechaExpiracionPasswordWindows

] = useState("");

const [diasRecordatorioPassword,
  setDiasRecordatorioPassword] =
  useState(5);
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
      idMonitor: "",
      tipoMonitor: "empresa"
    }
  ]);

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
passwordCorreoNoAplica,

fechaExpiracionAntivirus,

diasAlertaAntivirus,

fechaCambioPasswordWindows,
fechaExpiracionPasswordWindows,

diasRecordatorioPassword,

      passwordCorreo,

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
setNombreEquipo("");

setUsuarioAsignado("");

setWindows(
  "Windows 11 Pro"
);

setAntivirus("");

setPasswordWindows("");

setPasswordCorreo("");
setPasswordCorreoNoAplica(
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
    idMonitor: "",
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
    position: "absolute",

    right: "-40px",
    top: "-40px",

    width: "180px",
    height: "180px",

    borderRadius: "50%",

    background:
      "rgba(59,130,246,0.12)",

    filter: "blur(10px)"
  }}
/>

<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "20px",

    position: "relative",
    zIndex: 2
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

    fontSize: "42px",

    boxShadow:
      "0 15px 35px rgba(59,130,246,0.35)"
  }}
>
  💻
</div>

<div>

<h1
  style={{
    margin: 0,
    fontSize: "38px",
    color: "#fff",
    fontWeight: "800"
  }}
>
  Nuevo Equipo IT
</h1>

<p
  style={{
    marginTop: "10px",
    color: "#94a3b8",
    fontSize: "16px",
    maxWidth: "700px",
    lineHeight: "1.6"
  }}
>
  Registro corporativo de activos tecnológicos,
  seguridad, hardware y monitoreo empresarial.
</p>

</div>

</div>

</div>

{/* GRID PRINCIPAL */}

<div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    alignItems: "start"
  }}
>

{/* COLUMNA IZQUIERDA */}

<div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  }}
>

{/* DATOS GENERALES */}

<div
  className="card-pro"
  style={{
    padding: "28px"
  }}
>

<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "28px"
  }}
>

<div
  style={{
    width: "54px",
    height: "54px",
    borderRadius: "16px",
    background: "rgba(59,130,246,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px"
  }}
>
  🖥
</div>

<div>

<h2
  style={{
    margin: 0,
    color: "#fff"
  }}
>
  Datos Generales
</h2>

<p
  style={{
    marginTop: "4px",
    color: "#64748b",
    fontSize: "14px"
  }}
>
  Información principal del activo
</p>

</div>

</div>

<div
  style={{
    display: "grid",
    gap: "20px"
  }}
>

<div>

<label className="label-pro">
  Nombre del equipo
</label>

<input
  className="input-pro"
  placeholder="PC-ADMON-01"
  value={nombreEquipo}
  onChange={(e) =>
    setNombreEquipo(e.target.value)
  }
/>

</div>

<div>

<label className="label-pro">
  Usuario asignado
</label>

<input
  className="input-pro"
  placeholder="Miguel Alcalá"
  value={usuarioAsignado}
  onChange={(e) =>
    setUsuarioAsignado(e.target.value)
  }
/>

</div>

<div>

<label className="label-pro">
  Tipo de equipo
</label>

<select
  className="input-pro"
  value={tipoEquipo}
  onChange={(e) =>
    setTipoEquipo(e.target.value)
  }
>

<option value="laptop">
  💻 Laptop
</option>

<option value="desktop">
  🖥 Desktop
</option>

</select>

</div>

<div>

<label className="label-pro">
  Windows instalado
</label>

<select
  className="input-pro"
  value={windows}
  onChange={(e) =>
    setWindows(e.target.value)
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

</select>

</div>

<div>

<label className="label-pro">
  Antivirus
</label>

<input
  className="input-pro"
  placeholder="Microsoft Defender"
  value={antivirus}
  onChange={(e) =>
    setAntivirus(e.target.value)
  }
/>

</div>

</div>

</div>

</div>

{/* COLUMNA DERECHA */}

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

<div
  style={{
    display: "grid",
    gap: "20px"
  }}
>

<div>

<label className="label-pro">
  Password Windows
</label>

<input
  type="password"
  className="input-pro"
  value={passwordWindows}
  onChange={(e) =>
    setPasswordWindows(
      e.target.value
    )
  }
/>

</div>

<div>

<label className="label-pro">
  Password Correo
</label>

<input
  type="password"
  className="input-pro"
  value={passwordCorreo}
  onChange={(e) =>
    setPasswordCorreo(
      e.target.value
    )
  }
/>

</div>

<div>

<label className="label-pro">
  Fecha expiración antivirus
</label>

<input
  type="date"
  className="input-pro"
  value={fechaExpiracionAntivirus}
  onChange={(e) =>
    setFechaExpiracionAntivirus(
      e.target.value
    )
  }
/>

</div>

<div>

<label className="label-pro">
  Días alerta antivirus
</label>

<input
  type="number"
  className="input-pro"
  value={diasAlertaAntivirus}
  onChange={(e) =>
    setDiasAlertaAntivirus(
      Number(e.target.value)
    )
  }
/>

</div>

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

<div
  style={{
    display: "grid",
    gap: "20px"
  }}
>

<div>

<label className="label-pro">
  Cantidad monitores
</label>

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
        idMonitor: "",
        tipoMonitor: "empresa"
      }))
    );
  }}
>

<option value={1}>1</option>
<option value={2}>2</option>
<option value={3}>3</option>

</select>

</div>

</div>

</div>

)}

{tipoEquipo === "laptop" && (

<div
  className="card-pro"
  style={{
    padding: "18px",
    border:
      "1px solid rgba(59,130,246,0.25)",
    background:
      "rgba(59,130,246,0.08)",
    color: "#93c5fd"
  }}
>
  💻 Equipo portátil detectado.
</div>

)}

</div>

{/* OBSERVACIONES */}

<div
  className="card-pro"
  style={{
    padding: "28px",
    gridColumn: "1 / -1"
  }}
>

<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "28px"
  }}
>

<div
  style={{
    width: "54px",
    height: "54px",
    borderRadius: "16px",
    background:
      "rgba(245,158,11,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px"
  }}
>
  📝
</div>

<div>

<h2
  style={{
    margin: 0,
    color: "#fff"
  }}
>
  Observaciones
</h2>

<p
  style={{
    marginTop: "4px",
    color: "#64748b",
    fontSize: "14px"
  }}
>
  Información adicional y notas técnicas
</p>

</div>

</div>

<textarea
  className="input-pro"
  rows={7}
  value={observaciones}
  onChange={(e) =>
    setObservaciones(
      e.target.value
    )
  }
  placeholder="Detalles técnicos, observaciones, incidencias, cambios realizados..."
/>

</div>

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

  style={{
    padding: "14px 26px",

    fontSize: "15px",

    fontWeight: "700"
  }}
>
  💾 Guardar Equipo
</button>

</div>

</div>

);
}

export default NuevoEquipo;