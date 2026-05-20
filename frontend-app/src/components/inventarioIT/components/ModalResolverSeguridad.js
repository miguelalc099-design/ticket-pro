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

  passwordActualizado,

  setPasswordActualizado

] = useState(false);

const [

  observaciones,

  setObservaciones

] = useState("");

const guardar =
  async () => {

  try {

    const body = {

      fechaExpiracionAntivirus,

      mfa,

      observaciones

    };

    // 🔑 SOLO SI CAMBIASTE PASSWORD
    if (passwordActualizado) {

      body.fechaCambioPasswordWindows =
        new Date();

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

<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "12px"
  }}
>

<input
  type="checkbox"

  checked={
    passwordActualizado
  }

  onChange={(e) =>
    setPasswordActualizado(
      e.target.checked
    )
  }
/>

<label
  style={{
    color: "#cbd5e1"
  }}
>
  Ya actualicé el password
</label>

</div>

<div>

<label className="label-pro">
  Observaciones
</label>

<textarea
  className="input-pro"

  rows={5}

  value={observaciones}

  onChange={(e) =>
    setObservaciones(
      e.target.value
    )
  }

  placeholder="Detalles de actualización..."
/>

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