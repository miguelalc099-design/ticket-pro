import { useState } from "react";

function NuevaAuditoria({

  equipos,

  onCancel,

  onGuardar

}) {

/* =========================
   STATES
========================= */

const [

  nombreAuditoria,

  setNombreAuditoria

] = useState("");

const [

  auditor,

  setAuditor

] = useState("");

const [

  tipoAuditoria,

  setTipoAuditoria

] = useState("CTPAT");

const [

  equiposSeleccionados,

  setEquiposSeleccionados

] = useState([]);

/* =========================
   TOGGLE EQUIPO
========================= */

const toggleEquipo =
  (equipo) => {

  const existe =
    equiposSeleccionados.find(
      (e) => e._id === equipo._id
    );

  if (existe) {

    setEquiposSeleccionados(

      equiposSeleccionados.filter(
        (e) => e._id !== equipo._id
      )

    );

  } else {

    setEquiposSeleccionados([
      ...equiposSeleccionados,
      equipo
    ]);

  }

};

/* =========================
   GUARDAR
========================= */

const guardarAuditoria =
  () => {

  if (
    !nombreAuditoria ||
    equiposSeleccionados.length === 0
  ) {

    alert(
      "Completa los datos"
    );

    return;
  }

 const nueva = {

  nombreAuditoria,

  auditor,

  tipoAuditoria,

  fecha:
    new Date(),

equipos: equiposSeleccionados.map(
  (e) => ({

    ...e,

    serieFisica: "",
    observaciones: "",

    passwordInicio: null,
    bloqueoAutomatico: null,
    mfaActivo: null,
    antivirusActivo: null,

    escritorioLimpio: null,
    usbNoAutorizado: false

  })
),

  estado:
    "pendiente",

  finalizada: false

};

  onGuardar(nueva);

};

/* =========================
   JSX
========================= */

return (

<div className="main-pro">

{/* HEADER */}

<div
  className="card-pro"

  style={{
    padding: "32px",
    marginBottom: "30px"
  }}
>

<h1
  style={{
    marginTop: 0,
    color: "#fff"
  }}
>
  🛡 Nueva Auditoría IT
</h1>

<p
  style={{
    color: "#94a3b8"
  }}
>
  Crear auditoría corporativa
  de seguridad y compliance.
</p>

</div>

{/* FORM */}

<div
  style={{
    display: "grid",
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
  📋 Información General
</h2>

<div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(280px,1fr))",

    gap: "20px"
  }}
>

<div>

<label className="label-pro">
  Nombre auditoría
</label>

<input
  className="input-pro"

  placeholder="Ej. CTPAT Mayo 2026"

  value={nombreAuditoria}

  onChange={(e) =>
    setNombreAuditoria(
      e.target.value
    )
  }
/>

</div>

<div>

<label className="label-pro">
  Auditor
</label>

<input
  className="input-pro"

  placeholder="Nombre auditor"

  value={auditor}

  onChange={(e) =>
    setAuditor(
      e.target.value
    )
  }
/>

</div>

<div>

<label className="label-pro">
  Tipo auditoría
</label>

<select
  className="input-pro"

  value={tipoAuditoria}

  onChange={(e) =>
    setTipoAuditoria(
      e.target.value
    )
  }
>

<option>
  CTPAT
</option>

<option>
  Seguridad IT
</option>

<option>
  Compliance
</option>

<option>
  ISO 27001
</option>

<option>
  Inventario
</option>

</select>

</div>

</div>

</div>

{/* EQUIPOS */}

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
  💻 Seleccionar Equipos
</h2>

<div
  style={{
    display: "grid",
    gap: "18px",
    marginTop: "24px"
  }}
>

{
equipos.map((equipo) => {

const seleccionado =
  equiposSeleccionados.find(
    (e) => e._id === equipo._id
  );

return (

<div
  key={equipo._id}

  onClick={() =>
    toggleEquipo(equipo)
  }

  style={{

    padding: "22px",

    borderRadius: "18px",

    cursor: "pointer",

    transition: "0.2s",

    background:

      seleccionado

      ? "rgba(37,99,235,0.18)"

      : "rgba(15,23,42,0.55)",

    border:

      seleccionado

      ? "1px solid rgba(59,130,246,0.5)"

      : "1px solid rgba(51,65,85,0.7)"
  }}
>

<div
  style={{
    display: "flex",

    justifyContent:
      "space-between",

    alignItems: "center",

    gap: "20px"
  }}
>

<div>

<h3
  style={{
    color: "#fff",
    marginTop: 0,
    marginBottom: "8px"
  }}
>
  💻 {equipo.nombreEquipo}
</h3>

<p
  style={{
    color: "#94a3b8",
    margin: 0
  }}
>
  👤 {equipo.usuarioAsignado}
</p>

</div>

<div
  style={{
    fontSize: "26px"
  }}
>
  {
    seleccionado
    ? "✅"
    : "⬜"
  }
</div>

</div>

</div>

);

})
}

</div>

</div>

{/* FOOTER */}

<div
  style={{

    display: "flex",

    justifyContent:
      "flex-end",

    gap: "14px",

    marginBottom: "40px"
  }}
>

<button
  className="btn-pro btn-secondary"

  onClick={onCancel}
>
  Cancelar
</button>

<button
  className="btn-pro"

  onClick={guardarAuditoria}
>
  ✅ Guardar Auditoría
</button>

</div>

</div>

</div>

);

}

export default NuevaAuditoria;