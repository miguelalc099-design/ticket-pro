import { useState } from "react";

function NuevoEquipo() {

const [tipoEquipo, setTipoEquipo] =
  useState("laptop");

const [cantidadMonitores,
  setCantidadMonitores] =
  useState(1);

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

    gridTemplateColumns:
      "repeat(auto-fit,minmax(420px,1fr))",

    gap: "28px",

    alignItems: "start"
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

    background:
      "rgba(59,130,246,0.18)",

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
/>

</div>

<div>

<label className="label-pro">
  Usuario asignado
</label>

<input
  className="input-pro"
  placeholder="Miguel Alcalá"
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

</div>

<div>

<label className="label-pro">
  Windows instalado
</label>

<select className="input-pro">

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
/>

</div>

</div>

</div>

{/* SEGURIDAD */}

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

    background:
      "rgba(124,58,237,0.18)",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    fontSize: "24px"
  }}
>
  🔐
</div>

<div>

<h2
  style={{
    margin: 0,
    color: "#fff"
  }}
>
  Seguridad
</h2>

<p
  style={{
    marginTop: "4px",
    color: "#64748b",
    fontSize: "14px"
  }}
>
  Credenciales y protección del sistema
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
  Password Windows
</label>

<div
  style={{
    position: "relative"
  }}
>

<input
  type="password"

  className="input-pro"

  placeholder="••••••••••"
/>

<div
  style={{
    position: "absolute",
    right: "18px",
    top: "50%",
    transform: "translateY(-50%)",

    color: "#94a3b8",
    fontSize: "18px"
  }}
>
  👁
</div>

</div>

</div>

<div>

<label className="label-pro">
  Password Correo
</label>

<div
  style={{
    position: "relative"
  }}
>

<input
  type="password"

  className="input-pro"

  placeholder="••••••••••"
/>

<div
  style={{
    position: "absolute",
    right: "18px",
    top: "50%",
    transform: "translateY(-50%)",

    color: "#94a3b8",
    fontSize: "18px"
  }}
>
  👁
</div>

</div>

</div>

<div>

<label className="label-pro">
  Estado Antivirus
</label>

<select className="input-pro">

<option>
  ✅ Activo
</option>

<option>
  ⚠ Pendiente
</option>

<option>
  ❌ Inactivo
</option>

</select>

</div>

<div>

<label className="label-pro">
  MFA
</label>

<select className="input-pro">

<option>
  ✅ Configurado
</option>

<option>
  ❌ No configurado
</option>

</select>

</div>

</div>

</div>

{/* HARDWARE */}

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

    background:
      "rgba(16,185,129,0.18)",

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
  Hardware
</h2>

<p
  style={{
    marginTop: "4px",
    color: "#64748b",
    fontSize: "14px"
  }}
>
  Monitores y periféricos corporativos
</p>

</div>

</div>

{tipoEquipo === "desktop" ? (

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

  onChange={(e) =>
    setCantidadMonitores(
      Number(e.target.value)
    )
  }
>

<option value={1}>1</option>
<option value={2}>2</option>
<option value={3}>3</option>

</select>

</div>

{Array.from({
  length: cantidadMonitores
}).map((_, index) => (

<div
  key={index}

  style={{
    padding: "20px",

    borderRadius: "18px",

    background:
      "rgba(15,23,42,0.55)",

    border:
      "1px solid rgba(51,65,85,0.7)"
  }}
>

<h3
  style={{
    marginTop: 0,
    color: "#fff",
    marginBottom: "18px"
  }}
>
  🖥 Monitor {index + 1}
</h3>

<div
  style={{
    display: "grid",
    gap: "18px"
  }}
>

<input
  className="input-pro"

  placeholder="ID Monitor o N/A"
/>

<select className="input-pro">

<option>
  Empresa
</option>

<option>
  Prestado empleado
</option>

</select>

</div>

</div>

))}

</div>

) : (

<div
  style={{
    padding: "28px",

    borderRadius: "18px",

    background:
      "rgba(15,23,42,0.45)",

    border:
      "1px solid rgba(51,65,85,0.7)",

    color: "#94a3b8",

    textAlign: "center",

    fontSize: "15px"
  }}
>
  💻 Las laptops no requieren configuración
  de monitores corporativos.
</div>

)}

</div>

{/* OBSERVACIONES */}

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
>
  Cancelar
</button>

<button
  className="btn-pro"

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