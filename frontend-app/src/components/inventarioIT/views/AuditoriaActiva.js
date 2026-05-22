import {
  useEffect,
  useState
} from "react";

import ModalAuditoriaEquipo
from "../components/auditorias/ModalAuditoriaEquipo";

function AuditoriaActiva({

  auditoria,

  onFinalizar,

  onCancelar

}) {

const [
  resultadoEquipo,
  setResultadoEquipo
] = useState(null);


const [
  auditoriasGuardadas,
  setAuditoriasGuardadas
] = useState(

  auditoria.resultados || []

);


/* =========================
   STATES
========================= */

const [

  equipoActual,

  setEquipoActual

] = useState(0);

useEffect(() => {

  const actual =
    auditoriasGuardadas[
      equipoActual
    ];

  if (actual) {

    setResultadoEquipo(actual);

  }

}, [

  equipoActual,
  auditoriasGuardadas

]);

/* =========================
   DATA
========================= */

const equiposData =

  auditoria.finalizada
  && auditoria.resultados

    ? auditoria.resultados

    : auditoria.equipos;

const totalEquipos =
  equiposData.length;

const equipo =
  equiposData[
    equipoActual
  ];

const auditoriaGuardada =
  auditoriasGuardadas[
    equipoActual
  ];

/* =========================
   NAVEGACION
========================= */

const siguienteEquipo =
  () => {

if (

  !resultadoEquipo &&

  !auditoria.finalizada

) {

  alert(
    "Completa la auditoría del equipo"
  );

  return;
}

  const nuevaAuditoria = {

    equipoId:
      equipo._id,

    nombreEquipo:
      equipo.nombreEquipo,

    usuarioAsignado:
      equipo.usuarioAsignado,

    ...resultadoEquipo
  };

  const copia =
  [...auditoriasGuardadas];

copia[equipoActual] =
  nuevaAuditoria;

setAuditoriasGuardadas(
  copia
);

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
  async () => {

  try {

    let auditoriasFinales =
      [...auditoriasGuardadas];

    /* AGREGAR ULTIMO EQUIPO */

 if (resultadoEquipo) {

  auditoriasFinales[
    equipoActual
  ] = {

    equipoId:
      equipo._id,

    nombreEquipo:
      equipo.nombreEquipo,

    usuarioAsignado:
      equipo.usuarioAsignado,

    ...resultadoEquipo
  };

}

    /* BODY GENERAL */

   const body = {

  nombreAuditoria:
    auditoria.nombreAuditoria,

tipoAuditoria:
  auditoria.tipoAuditoria,

  auditor:
    JSON.parse(
      localStorage.getItem("user")
    )?.username || "Auditor",

  estado:
    "finalizada",

      finalizada: true,

      fechaInicio:
        auditoria.fechaInicio
        || new Date(),

      fechaFinalizacion:
        new Date(),

      equipos:
        auditoriasFinales
    };

    /* GUARDAR GENERAL */

    const res =
      await fetch(

        "https://ticket-pro-backend.onrender.com/it/auditorias-generales",

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

    await res.json();

    alert(
      "✅ Auditoría finalizada correctamente"
    );

    onFinalizar({

  ...auditoria,

  estado: "finalizada",

  bloqueada: true,

  finalizada: true,

  fechaFinalizacion:
    new Date(),

  resultados:
    auditoriasFinales

});

  } catch (err) {

    console.log(err);

    alert(
      "Error finalizando auditoría"
    );
  }
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
<button
  className="btn-pro btn-secondary"

  onClick={onCancelar}
>
  ✖ Salir Auditoría
</button>
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
style={{

  display: "grid",

  gridTemplateColumns:
    "280px minmax(0,1fr) 260px",

  gap: "24px",

  alignItems: "start",

  width: "100%"
}}
>

{/* IZQUIERDA */}
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
  🖥 Información del Equipo
</h2>

<div
  style={{
    display: "grid",
    gap: "24px"
  }}
>

<div>

<div
  style={{
    color: "#94a3b8"
  }}
>
  Nombre del equipo
</div>

<div
  style={{
    color: "#fff",
    fontWeight: "700",
    marginTop: "6px"
  }}
>
  {equipo.nombreEquipo}
</div>

</div>

<div>

<div
  style={{
    color: "#94a3b8"
  }}
>
  Usuario asignado
</div>

<div
  style={{
    color: "#fff",
    fontWeight: "700",
    marginTop: "6px"
  }}
>
  👤 {equipo.usuarioAsignado}
</div>

</div>

<div>

<div
  style={{
    color: "#94a3b8"
  }}
>
  Departamento
</div>

<div
  style={{
    color: "#fff",
    fontWeight: "700",
    marginTop: "6px"
  }}
>
  Sistemas
</div>

</div>

<div>

<div
  style={{
    color: "#94a3b8"
  }}
>
  Tipo de equipo
</div>

<div
  style={{
    color: "#fff",
    fontWeight: "700",
    marginTop: "6px"
  }}
>
  Desktop
</div>

</div>

<div>

<div
  style={{
    color: "#94a3b8"
  }}
>
  Estado actual
</div>

<div
  style={{

    marginTop: "10px",

    display: "inline-flex",

    padding: "10px 14px",

    borderRadius: "12px",

    background:
      "rgba(34,197,94,0.12)",

    color: "#22c55e",

    fontWeight: "700"
  }}
>
  En uso
</div>

</div>

</div>

</div>

{/* CENTRO */}

<div
  className="card-pro"

  style={{
  padding: "28px",

  minWidth: 0
}}
>

<h2
  style={{
    color: "#fff",
    marginTop: 0,
    marginBottom: "24px"
  }}
>
  📋 Checklist de Auditoría
</h2>

<ModalAuditoriaEquipo

  key={equipo.equipoId || equipo._id}

auditoria={{
  ...equipo,
  ...auditoriaGuardada,
  finalizada:
    auditoria.finalizada
}}

 onChange={(resultado) => {

  setResultadoEquipo({
    ...resultado,

    equipoId:
      equipo._id,

    nombreEquipo:
      equipo.nombreEquipo,

    usuarioAsignado:
      equipo.usuarioAsignado
  });

}}

/>

</div>

{/* DERECHA */}

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
  📊 Resumen del Equipo
</h2>

<div
  style={{
    display: "flex",
    justifyContent: "center",
    marginTop: "34px",
    marginBottom: "34px"
  }}
>

<div
  style={{

    width: "180px",

    height: "180px",

    borderRadius: "50%",

    border:
      "12px solid rgba(59,130,246,0.22)",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    flexDirection: "column"
  }}
>

<div
  style={{
    color: "#fff",
    fontSize: "46px",
    fontWeight: "700"
  }}
>
  {
resultadoEquipo?.score || 0
}%
</div>

<div
  style={{
    color: "#94a3b8"
  }}
>
  Score Actual
</div>

</div>

</div>

<div
  style={{
    color: "#94a3b8",
    marginBottom: "10px"
  }}
>
  Estado del Equipo
</div>

<div
  style={{

    padding: "14px",

    borderRadius: "14px",

    background:

      resultadoEquipo?.estado ===
      "EXCELENTE"

      ? "rgba(34,197,94,0.12)"

      : resultadoEquipo?.estado ===
        "ACEPTABLE"

      ? "rgba(245,158,11,0.12)"

      : "rgba(239,68,68,0.12)",

    color:

      resultadoEquipo?.estado ===
      "EXCELENTE"

      ? "#22c55e"

      : resultadoEquipo?.estado ===
        "ACEPTABLE"

      ? "#f59e0b"

      : "#ef4444",

    textAlign: "center",

    fontWeight: "700"
  }}
>
  {
    resultadoEquipo?.estado
    || "RIESGO"
  }
</div>

</div>

</div>

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

  onClick={anteriorEquipo}

  disabled={equipoActual === 0}
>
  ⬅ Anterior
</button>

{
  equipoActual <
  totalEquipos - 1 && (

    <button
      className="btn-pro"

      onClick={siguienteEquipo}
    >
      ➡ Siguiente
    </button>

  )
}

{
  !auditoria.finalizada &&
  equipoActual === totalEquipos - 1 && (

    <button
      className="btn-pro"

      onClick={finalizarAuditoria}
    >
      ✅ Finalizar Auditoría
    </button>

  )
}

</div>

</div>

</div>
);

}

export default AuditoriaActiva;