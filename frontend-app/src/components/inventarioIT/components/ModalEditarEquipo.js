import { useState } from "react";

import { toast }
from "react-toastify";

function ModalEditarEquipo({

  equipo,

  onClose

}) {

const API =
  "https://ticket-pro-backend.onrender.com";

const [nombreEquipo,
  setNombreEquipo] =
  useState(
    equipo?.nombreEquipo || ""
  );

const [usuarioAsignado,
  setUsuarioAsignado] =
  useState(
    equipo?.usuarioAsignado || ""
  );

const [windows,
  setWindows] =
  useState(
    equipo?.windows || ""
  );

const [antivirus,
  setAntivirus] =
  useState(
    equipo?.antivirus || ""
  );

const guardarCambios =
  async () => {

  try {

    const body = {

      nombreEquipo,

      usuarioAsignado,

      windows,

      antivirus

    };

    const res = await fetch(

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

    if (!res.ok) {

      throw new Error(
        "Error actualizando"
      );

    }

    toast.success(
      "Equipo actualizado"
    );

    onClose();

    window.location.reload();

  } catch (err) {

    console.log(err);

    toast.error(
      "Error actualizando equipo"
    );

  }

};

return (

<div
  style={{

    position: "fixed",

    inset: 0,

    background:
      "rgba(2,6,23,0.82)",

    backdropFilter: "blur(8px)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    zIndex: 9999,

    padding: "20px"
  }}
>

<div
  className="card-pro"

  style={{

    width: "100%",

    maxWidth: "700px",

    padding: "32px",

    position: "relative",

    background:
      "linear-gradient(145deg, rgba(15,23,42,0.96), rgba(15,23,42,0.88))",

    border:
      "1px solid rgba(51,65,85,0.8)"
  }}
>

{/* CERRAR */}

<button

  onClick={onClose}

  style={{

    position: "absolute",

    right: "20px",

    top: "20px",

    width: "42px",

    height: "42px",

    borderRadius: "12px",

    border: "none",

    background:
      "rgba(239,68,68,0.15)",

    color: "#ef4444",

    cursor: "pointer",

    fontSize: "18px"
  }}
>
  ✕
</button>

<h1
  style={{
    color: "#fff",
    marginTop: 0,
    marginBottom: "30px"
  }}
>
  ✏ Editar Equipo
</h1>

<div
  style={{
    display: "grid",
    gap: "20px"
  }}
>

<div>

<label className="label-pro">
  Nombre Equipo
</label>

<input
  className="input-pro"

  value={nombreEquipo}

  onChange={(e) =>
    setNombreEquipo(
      e.target.value
    )
  }
/>

</div>

<div>

<label className="label-pro">
  Usuario Asignado
</label>

<input
  className="input-pro"

  value={usuarioAsignado}

  onChange={(e) =>
    setUsuarioAsignado(
      e.target.value
    )
  }
/>

</div>

<div>

<label className="label-pro">
  Windows
</label>

<input
  className="input-pro"

  value={windows}

  onChange={(e) =>
    setWindows(
      e.target.value
    )
  }
/>

</div>

<div>

<label className="label-pro">
  Antivirus
</label>

<input
  className="input-pro"

  value={antivirus}

  onChange={(e) =>
    setAntivirus(
      e.target.value
    )
  }
/>

</div>

<button
  className="btn-pro"

  onClick={guardarCambios}
>
  💾 Guardar Cambios
</button>

</div>

</div>

</div>

);

}

export default ModalEditarEquipo;