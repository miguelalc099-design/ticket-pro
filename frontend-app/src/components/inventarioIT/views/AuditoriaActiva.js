import { useState } from "react";

import ModalAuditoriaEquipo
from "../components/auditorias/ModalAuditoriaEquipo";

function AuditoriaActiva({

  auditoria,

  onFinalizar

}) {

/* =========================
   STATES
========================= */

const [

  equipoActual,

  setEquipoActual

] = useState(0);

/* =========================
   DATA
========================= */

const totalEquipos =
  auditoria.equipos.length;

const equipo =
  auditoria.equipos[
    equipoActual
  ];

/* =========================
   NAVEGACION
========================= */

const siguienteEquipo =
  () => {

  if (
    equipoActual <
    totalEquipos - 1
  ) {

    setEquipoActual(
      equipoActual + 1
    );

  }

};

const anteriorEquipo =
  () => {

  if (
    equipoActual > 0
  ) {

    setEquipoActual(
      equipoActual - 1
    );

  }

};

/* =========================
   FINALIZAR
========================= */

const finalizarAuditoria =
  () => {

  onFinalizar({

    ...auditoria,

    estado:
      "finalizada",

    bloqueada: true,

    fechaFinalizacion:
      new Date()

  });

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
    padding: "30px",
    marginBottom: "30px"
  }}
>

<div
  style={{
    display: "flex",

    justifyContent:
      "space-between",

    alignItems: "center",

    gap: "20px",

    flexWrap: "wrap"
  }}
>

<div>

<h1
  style={{
    marginTop: 0,
    color: "#fff"
  }}
>
  🛡 Auditoría Activa
</h1>

<p
  style={{
    color: "#94a3b8",
    marginBottom: 0
  }}
>
  {auditoria.nombreAuditoria}
</p>

</div>

<div
  style={{
    padding: "12px 18px",

    borderRadius: "16px",

    background:
      "rgba(59,130,246,0.14)",

    color: "#60a5fa",

    fontWeight: "700"
  }}
>
  Equipo {equipoActual + 1}
  {" "}de{" "}
  {totalEquipos}
</div>

</div>

</div>

{/* PROGRESO */}

<div
  className="card-pro"

  style={{
    padding: "24px",
    marginBottom: "30px"
  }}
>

<div
  style={{
    display: "flex",

    justifyContent:
      "space-between",

    marginBottom: "14px"
  }}
>

<div
  style={{
    color: "#fff",
    fontWeight: "700"
  }}
>
  Progreso Auditoría
</div>

<div
  style={{
    color: "#94a3b8"
  }}
>
  {
    Math.round(
      (
        (equipoActual + 1)
        /
        totalEquipos
      ) * 100
    )
  }%
</div>

</div>

<div
  style={{
    height: "12px",

    borderRadius: "999px",

    background:
      "rgba(51,65,85,0.55)",

    overflow: "hidden"
  }}
>

<div
  style={{
    width:
      `${
        (
          (equipoActual + 1)
          /
          totalEquipos
        ) * 100
      }%`,

    height: "100%",

    background:
      "linear-gradient(90deg,#3b82f6,#06b6d4)"
  }}
/>

</div>

</div>

{/* EQUIPO */}

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
  💻 {equipo.nombreEquipo}
</h2>

<p
  style={{
    color: "#94a3b8"
  }}
>
  👤 {equipo.usuarioAsignado}
</p>

<div
  style={{
    marginTop: "24px"
  }}
>

<ModalAuditoriaEquipo
  auditoria={equipo}
/>

</div>

</div>

{/* FOOTER */}

<div
  style={{

    display: "flex",

    justifyContent:
      "space-between",

    marginTop: "30px",

    gap: "20px",

    flexWrap: "wrap"
  }}
>

<div
  style={{
    display: "flex",
    gap: "12px"
  }}
>

<button
  className="btn-pro btn-secondary"

  disabled={equipoActual === 0}

  onClick={anteriorEquipo}
>
  ⬅ Anterior
</button>

<button
  className="btn-pro"

  disabled={
    equipoActual ===
    totalEquipos - 1
  }

  onClick={siguienteEquipo}
>
  ➡ Siguiente
</button>

</div>

<button
  className="btn-pro"

  onClick={finalizarAuditoria}

  style={{
    border:
      "1px solid rgba(34,197,94,0.4)"
  }}
>
  ✅ Finalizar Auditoría
</button>

</div>

</div>

);

}

export default AuditoriaActiva;