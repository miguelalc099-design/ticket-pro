import { useState } from "react";

function ModalResolverSeguridad({

  equipo,

  onClose,

  recargarEquipos

}) {

const API =
  "https://ticket-pro-backend.onrender.com";

const [

  fechaExpiracionAntivirus,

  setFechaExpiracionAntivirus

] = useState(

  equipo?.fechaExpiracionAntivirus
    ?.split("T")[0] || ""

);

const [

  mfa,

  setMfa

] = useState(

  equipo?.mfa ?? true

);

const [

  nuevaPasswordWindows,

  setNuevaPasswordWindows

] = useState("");

const [

  confirmarPasswordWindows,

  setConfirmarPasswordWindows

] = useState("");

const [

  nuevaPasswordCorreo,

  setNuevaPasswordCorreo

] = useState("");

const [

  confirmarPasswordCorreo,

  setConfirmarPasswordCorreo

] = useState("");

const [

  observaciones,

  setObservaciones

] = useState("");

const guardar =
  async () => {

  try {
// 🔐 VALIDAR PASSWORD WINDOWS

if (

  nuevaPasswordWindows &&

  nuevaPasswordWindows !==
    confirmarPasswordWindows

) {

  alert(
    "Las passwords Windows no coinciden"
  );

  return;

}

if (

  nuevaPasswordWindows &&

  nuevaPasswordWindows ===
    equipo.passwordWindows

) {

  alert(
    "La nueva password Windows no puede ser igual a la anterior"
  );

  return;

}

// 🔐 VALIDAR PASSWORD CORREO

if (

  nuevaPasswordCorreo &&

  nuevaPasswordCorreo !==
    confirmarPasswordCorreo

) {

  alert(
    "Las passwords correo no coinciden"
  );

  return;

}

if (

  nuevaPasswordCorreo &&

  nuevaPasswordCorreo ===
    equipo.passwordCorreo

) {

  alert(
    "La nueva password correo no puede ser igual a la anterior"
  );

  return;

}
    const body = {

      fechaExpiracionAntivirus,

      mfa,

      observaciones

    };
// 🔐 WINDOWS

if (nuevaPasswordWindows) {

  body.passwordWindows =
    nuevaPasswordWindows;

  body.fechaCambioPasswordWindows =
    new Date();

}

// 🔐 CORREO

if (nuevaPasswordCorreo) {

  body.passwordCorreo =
    nuevaPasswordCorreo;

}

   
    await fetch(

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

    recargarEquipos();

    onClose();

  } catch (err) {

    console.log(err);

  }

};

return (

<div
  style={{

    position: "fixed",

    inset: 0,

    background:
      "rgba(2,6,23,0.85)",

    backdropFilter:
      "blur(8px)",

    display: "flex",

    justifyContent:
      "center",

    alignItems: "center",

    zIndex: 9999

  }}
>

<div
  className="card-pro"

  style={{

    width: "100%",

    maxWidth: "650px",

    padding: "30px",

    position: "relative"

  }}
>

<button

  onClick={onClose}

  style={{

    position: "absolute",

    right: "20px",

    top: "20px",

    background: "none",

    border: "none",

    color: "#fff",

    cursor: "pointer",

    fontSize: "22px"

  }}
>
  ✕
</button>

<h1
  style={{
    color: "#fff",
    marginTop: 0
  }}
>
  ✅ Resolver Seguridad
</h1>

<p
  style={{
    color: "#94a3b8"
  }}
>
  {equipo?.nombreEquipo}
</p>

<div
  style={{
    display: "grid",
    gap: "20px",
    marginTop: "30px"
  }}
>

<div>

<label className="label-pro">
  Nueva fecha antivirus
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
  Activo
</option>

<option value="no">
  Desactivado
</option>

</select>

</div>

{/* PASSWORD WINDOWS */}

<div>

<label className="label-pro">
  Nueva password Windows
</label>

<input
  type="password"

  className="input-pro"

  value={
    nuevaPasswordWindows
  }

  onChange={(e) =>
    setNuevaPasswordWindows(
      e.target.value
    )
  }
/>

</div>

<div>

<label className="label-pro">
  Confirmar password Windows
</label>

<input
  type="password"

  className="input-pro"

  value={
    confirmarPasswordWindows
  }

  onChange={(e) =>
    setConfirmarPasswordWindows(
      e.target.value
    )
  }
/>

</div>

{/* PASSWORD CORREO */}

<div>

<label className="label-pro">
  Nueva password Correo
</label>

<input
  type="password"

  className="input-pro"

  value={
    nuevaPasswordCorreo
  }

  onChange={(e) =>
    setNuevaPasswordCorreo(
      e.target.value
    )
  }
/>

</div>

<div>

<label className="label-pro">
  Confirmar password Correo
</label>

<input
  type="password"

  className="input-pro"

  value={
    confirmarPasswordCorreo
  }

  onChange={(e) =>
    setConfirmarPasswordCorreo(
      e.target.value
    )
  }
/>

</div>

<div>

<label className="label-pro">
  Observaciones
</label>

<textarea
  className="input-pro"

  rows={3}

  value={observaciones}

  onChange={(e) =>
    setObservaciones(
      e.target.value
    )
  }

  placeholder="Detalles de actualización..."
/>

</div>
<div
  style={{
    padding: "18px",
    borderRadius: "16px",

    background:
      "rgba(59,130,246,0.12)",

    border:
      "1px solid rgba(59,130,246,0.25)",

    color: "#93c5fd",

    fontSize: "14px",

    lineHeight: "1.6"
  }}
>
  🔐 Resolver seguridad actualizará:

  <ul
    style={{
      marginTop: "12px"
    }}
  >
    <li>
      Renovación antivirus
    </li>

    <li>
      Activación MFA
    </li>

    <li>
      Cambio de passwords
    </li>

    <li>
      Fecha de seguridad
      del equipo
    </li>
  </ul>
</div>
<button
  className="btn-pro"

  onClick={guardar}
>
  💾 Guardar Resolución
</button>

</div>

</div>

</div>

);

}

export default ModalResolverSeguridad;