import { useState } from "react";

function AuditoriasIT({ equipos }) {

const [auditorias, setAuditorias] =
  useState([]);

const crearAuditoria = () => {

  const nueva = {

    id: Date.now(),

    nombre:
      `Auditoría ${new Date().toLocaleDateString()}`,

    fecha:
      new Date(),

    equipos: equipos.map((e) => ({

      ...e,

      checklist: {

        bloqueoAutomatico: false,

        passwordDesbloqueo: false,

        serieValidada: false,

        antivirusActivo: false,

        escritorioLimpio: false,

        usbNoAutorizado: false

      }

    }))

  };

  setAuditorias([
    nueva,
    ...auditorias
  ]);

};

return (

<div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  }}
>

{/* HEADER */}

<div
  className="card-pro"
  style={{
    padding: "30px"
  }}
>

<h1
  style={{
    marginTop: 0,
    color: "#fff"
  }}
>
  🛡 Auditorías IT
</h1>

<p
  style={{
    color: "#94a3b8"
  }}
>
  Validación corporativa de
  seguridad, inventario y cumplimiento IT.
</p>

<button
  className="btn-pro"

  onClick={crearAuditoria}
>
  ➕ Generar Nueva Auditoría
</button>

</div>

{/* SIN AUDITORIAS */}

{
auditorias.length === 0 && (

<div
  className="card-pro"
  style={{
    padding: "40px",
    textAlign: "center"
  }}
>

<h2
  style={{
    color: "#fff"
  }}
>
  No existen auditorías
</h2>

<p
  style={{
    color: "#94a3b8"
  }}
>
  Genera una nueva auditoría IT
</p>

</div>

)}

{/* AUDITORIAS */}

{
auditorias.map((auditoria) => (

<div
  key={auditoria.id}

  className="card-pro"

  style={{
    padding: "28px"
  }}
>

<h2
  style={{
    marginTop: 0,
    color: "#60a5fa"
  }}
>
  📋 {auditoria.nombre}
</h2>

<p
  style={{
    color: "#94a3b8"
  }}
>
  Equipos:
  {" "}
  {auditoria.equipos.length}
</p>

<div
  style={{
    display: "grid",
    gap: "18px",
    marginTop: "24px"
  }}
>

{
auditoria.equipos.map((equipo) => (

<div
  key={equipo._id}

  style={{
    padding: "22px",

    borderRadius: "18px",

    background:
      "rgba(15,23,42,0.5)",

    border:
      "1px solid rgba(51,65,85,0.6)"
  }}
>

<h3
  style={{
    color: "#fff",
    marginTop: 0
  }}
>
  💻 {equipo.nombreEquipo}
</h3>

<p
  style={{
    color: "#94a3b8"
  }}
>
  👤 {equipo.usuarioAsignado}
</p>

<div
  style={{
    display: "grid",
    gap: "12px",
    marginTop: "18px"
  }}
>

<label>
  <input type="checkbox" />
  {" "}
  Equipo se bloquea automáticamente
</label>

<label>
  <input type="checkbox" />
  {" "}
  Solicita password al desbloquear
</label>

<label>
  <input type="checkbox" />
  {" "}
  Número de serie validado
</label>

<label>
  <input type="checkbox" />
  {" "}
  Antivirus validado
</label>

<label>
  <input type="checkbox" />
  {" "}
  Escritorio limpio
</label>

<label>
  <input type="checkbox" />
  {" "}
  Sin USB no autorizados
</label>

</div>

</div>

))
}

</div>

</div>

))
}

</div>

);

}

export default AuditoriasIT;