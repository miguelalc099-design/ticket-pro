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
   HARDWARE
========================= */

const [numeroSerie,
  setNumeroSerie] =
  useState("");

const [marca,
  setMarca] =
  useState("");

const [modelo,
  setModelo] =
  useState("");

const [procesador,
  setProcesador] =
  useState("");

const [ram,
  setRam] =
  useState("");

const [tarjetaGrafica,
  setTarjetaGrafica] =
  useState("");

const [almacenamiento,
  setAlmacenamiento] =
  useState("");

const [tipoSistema,
  setTipoSistema] =
  useState("");

const [idDispositivo,
  setIdDispositivo] =
  useState("");

const [idProducto,
  setIdProducto] =
  useState("");

/* =========================
   ACTIVOS
========================= */

const [fechaCompra,
  setFechaCompra] =
  useState("");

const [garantiaHasta,
  setGarantiaHasta] =
  useState("");

const [proveedor,
  setProveedor] =
  useState("");

const [factura,
  setFactura] =
  useState("");

const [numeroActivo,
  setNumeroActivo] =
  useState("");

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
] = useState(false);

const [
  fechaCambioPasswordWindows,
  setFechaCambioPasswordWindows
] = useState("");

const [
  fechaExpiracionPasswordWindows,
  setFechaExpiracionPasswordWindows
] = useState("");

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
] = useState(false);

const [
  fechaCambioPasswordERP,
  setFechaCambioPasswordERP
] = useState("");

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

    if (!nombreEquipo.trim()) {

      toast.error(
        "Nombre equipo requerido"
      );

      return;
    }

    if (!usuarioAsignado.trim()) {

      toast.error(
        "Usuario asignado requerido"
      );

      return;
    }

    if (!numeroSerie.trim()) {

      toast.error(
        "Número de serie requerido"
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

    const body = {

      nombreEquipo,

      usuarioAsignado,

      tipoEquipo,

      windows,

      antivirus,

      numeroSerie,

      marca,

      modelo,

      procesador,

      ram,

      tarjetaGrafica,

      almacenamiento,

      tipoSistema,

      idDispositivo,

      idProducto,

      fechaCompra,

      garantiaHasta,

      proveedor,

      factura,

      numeroActivo,

      passwordWindows,

      passwordWindowsDesconocido,

      fechaCambioPasswordWindows,

      fechaExpiracionPasswordWindows,

      passwordERP,

      passwordERPNoAplica,

      fechaCambioPasswordERP,

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

<div
  className="card-pro"
  style={{
    padding: "35px",
    background:
      "linear-gradient(145deg, rgba(37,99,235,0.18), rgba(124,58,237,0.14))"
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

{/* DATOS GENERALES */}

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
  🖥 Datos Generales
</h2>

<div
  style={{
    display: "grid",
    gap: "18px"
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

<input
  className="input-pro"
  placeholder="Número de serie"
  value={numeroSerie}
  onChange={(e) =>
    setNumeroSerie(
      e.target.value
    )
  }
/>

<input
  className="input-pro"
  placeholder="Marca"
  value={marca}
  onChange={(e) =>
    setMarca(
      e.target.value
    )
  }
/>

<input
  className="input-pro"
  placeholder="Modelo"
  value={modelo}
  onChange={(e) =>
    setModelo(
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
  Windows Server 2019
</option>

<option>
  Windows Server 2022
</option>

<option>
  macOS Sonoma
</option>

<option>
  macOS Ventura
</option>

<option>
  Linux Ubuntu
</option>

<option>
  Linux Mint
</option>

<option>
  Debian
</option>

<option>
  Kali Linux
</option>

<option>
  ChromeOS
</option>

</select>

</div>

</div>
{/* MONITORES */}

{
tipoEquipo === "desktop" && (

<div
  className="card-pro"
  style={{
    padding: "24px",
    border:
      "1px solid rgba(59,130,246,0.25)",
    background:
      "linear-gradient(145deg, rgba(30,41,59,0.85), rgba(15,23,42,0.95))",
    animation:
      "fadeIn 0.25s ease"
  }}
>
  style={{
    padding: "24px"
  }}
>

<h2
  style={{
    color: "#fff",
    marginTop: 0
  }}
>
  🖥 Monitores
</h2>

<div
  style={{
    display: "grid",
    gap: "18px"
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

      Array.from(
        { length: cantidad },

        (_, i) => (

          monitores[i] || {

            marca: "",

            modelo: "",

            serie: "",

            tipoMonitor:
              "empresa"
          }

        )
      )
    );
  }}
>

<option value={1}>
  1 Monitor
</option>

<option value={2}>
  2 Monitores
</option>

<option value={3}>
  3 Monitores
</option>

<option value={4}>
  4 Monitores
</option>

</select>

{
monitores.map(
  (monitor, index) => (

<div
  key={index}

  style={{
    padding: "18px",
    borderRadius: "14px",

    background:
      "rgba(15,23,42,0.45)",

    border:
      "1px solid rgba(51,65,85,0.5)",

    display: "grid",
    gap: "14px"
  }}
>

<h3
  style={{
    margin: 0,
    color: "#60a5fa"
  }}
>
  Monitor {index + 1}
</h3>

<input
  className="input-pro"
  placeholder="Marca"

  value={monitor.marca}

  onChange={(e) => {

    const copia =
      [...monitores];

    copia[index].marca =
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

    copia[index].modelo =
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

    copia[index].serie =
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

    copia[index].tipoMonitor =
      e.target.value;

    setMonitores(copia);
  }}
>

<option value="empresa">
  Empresa
</option>

<option value="personal">
  Personal
</option>

</select>

</div>

))
}

</div>

</div>

)
}
{/* HARDWARE */}

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
  ⚙ Hardware
</h2>

<div
  style={{
    display: "grid",
    gap: "18px"
  }}
>

<input
  className="input-pro"
  placeholder="Procesador"
  value={procesador}
  onChange={(e) =>
    setProcesador(
      e.target.value
    )
  }
/>

<input
  className="input-pro"
  placeholder="RAM"
  value={ram}
  onChange={(e) =>
    setRam(
      e.target.value
    )
  }
/>

<input
  className="input-pro"
  placeholder="Tarjeta gráfica"
  value={tarjetaGrafica}
  onChange={(e) =>
    setTarjetaGrafica(
      e.target.value
    )
  }
/>

<input
  className="input-pro"
  placeholder="Almacenamiento"
  value={almacenamiento}
  onChange={(e) =>
    setAlmacenamiento(
      e.target.value
    )
  }
/>

<input
  className="input-pro"
  placeholder="Tipo sistema"
  value={tipoSistema}
  onChange={(e) =>
    setTipoSistema(
      e.target.value
    )
  }
/>

<input
  className="input-pro"
  placeholder="ID dispositivo"
  value={idDispositivo}
  onChange={(e) =>
    setIdDispositivo(
      e.target.value
    )
  }
/>

<input
  className="input-pro"
  placeholder="ID producto"
  value={idProducto}
  onChange={(e) =>
    setIdProducto(
      e.target.value
    )
  }
/>

</div>

</div>

</div>

{/* DERECHA */}

<div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  }}
>

{/* PASSWORD WINDOWS */}

<div
  className="card-pro"
  style={{
    padding: "24px"
  }}
>

<h2
  style={{
    color: "#fff",
    marginTop: 0
  }}
>
  🔐 Password Windows
</h2>

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
      windowsPasswordsCoinciden
      ? "#22c55e"
      : "#ef4444",

    fontWeight: "700"
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

<div
  style={{
    color: "#94a3b8",
    fontSize: "13px"
  }}
>
  📅 Fecha en que el usuario CAMBIÓ la password Windows por última vez
</div>

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
<div
  style={{
    color: "#94a3b8",
    fontSize: "13px"
  }}
>
  ⏳ Fecha límite para volver a cambiar la password Windows
</div>
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
{/* PASSWORD ERP */}

<div
  className="card-pro"
  style={{
    padding: "24px"
  }}
>

<h2
  style={{
    color: "#fff",
    marginTop: 0
  }}
>
  🏢 Password ERP
</h2>

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
      erpPasswordsCoinciden
      ? "#22c55e"
      : "#ef4444",

    fontWeight: "700"
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
<div
  style={{
    color: "#94a3b8",
    fontSize: "13px"
  }}
>
  📅 Fecha en que el usuario CAMBIÓ la password ERP/correo por última vez
</div>
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
<div
  style={{
    color: "#94a3b8",
    fontSize: "13px"
  }}
>
  ⏳ Fecha límite para volver a cambiar la password ERP/correo
</div>
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

{/* SEGURIDAD */}

<div
  className="card-pro"
  style={{
    padding: "24px"
  }}
>

<h2
  style={{
    color: "#fff",
    marginTop: 0
  }}
>
  🛡 Seguridad IT
</h2>

<div
  style={{
    display: "grid",
    gap: "16px"
  }}
>

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
  CrowdStrike
</option>

<option>
  Kaspersky
</option>

<option>
  Sophos
</option>

<option>
  SentinelOne
</option>

</select>

{
antivirus !== "Microsoft Defender" &&
antivirus !== "" && (

<>

<div
  style={{
    color: "#94a3b8",
    fontSize: "13px"
  }}
>
  🛡 Fecha en la que expira la licencia del antivirus
</div>

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

</>

)}

{
antivirus === "Microsoft Defender" && (

<div
  style={{
    padding: "14px",
    borderRadius: "14px",
    background:
      "rgba(16,185,129,0.12)",
    color: "#6ee7b7"
  }}
>
  ✅ Microsoft Defender no requiere expiración.
</div>

)}

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
    color: "#fff",
    marginTop: 0
  }}
>
  🏷 Activos / Compra
</h2>

<div
  style={{
    display: "grid",
    gap: "18px"
  }}
>

<input
  className="input-pro"
  placeholder="Número activo"
  value={numeroActivo}
  onChange={(e) =>
    setNumeroActivo(
      e.target.value
    )
  }
/>

<input
  className="input-pro"
  placeholder="Proveedor"
  value={proveedor}
  onChange={(e) =>
    setProveedor(
      e.target.value
    )
  }
/>

<input
  className="input-pro"
  placeholder="Factura"
  value={factura}
  onChange={(e) =>
    setFactura(
      e.target.value
    )
  }
/>
<div
  style={{
    color: "#94a3b8",
    fontSize: "13px"
  }}
>
  🧾 Fecha real en la que se compró el equipo
</div>
<input
  type="date"
  className="input-pro"
  value={fechaCompra}
  onChange={(e) =>
    setFechaCompra(
      e.target.value
    )
  }
/>
<div
  style={{
    color: "#94a3b8",
    fontSize: "13px"
  }}
>
  🏷 Fecha en la que termina la garantía del fabricante
</div>
<input
  type="date"
  className="input-pro"
  value={garantiaHasta}
  onChange={(e) =>
    setGarantiaHasta(
      e.target.value
    )
  }
/>

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
  📝 Observaciones
</h2>

<textarea
  className="input-pro"
  rows={6}
  value={observaciones}
  onChange={(e) =>
    setObservaciones(
      e.target.value
    )
  }
/>

</div>

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