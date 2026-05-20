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

  fechaExpiracionPasswordWindows,

  setFechaExpiracionPasswordWindows

] = useState(

  equipo?.fechaExpiracionPasswordWindows
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

      fechaExpiracionPasswordWindows,

      mfa,

      observaciones

    };

    // 🔐 WINDOWS

    if (nuevaPasswordWindows) {

      body.passwordWindows =
        nuevaPasswordWindows;

      body.fechaCambioPasswordWindows =
        new Date();

      body.fechaExpiracionPasswordWindows =
        fechaExpiracionPasswordWindows;

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

    alignItems:
      "flex-start",

    overflowY: "auto",

    padding: "30px 20px",

    zIndex: 9999

  }}
>

<div
  className="card-pro"

  style={{

    width: "100%",

    maxWidth: "700px",

    maxHeight:
      "calc(100vh - 60px)",

    overflowY: "auto",

    padding: "30px",

    position: "relative",

    background:
      "linear-gradient(145deg, rgba(15,23,42,0.96), rgba(15,23,42,0.88))",

    border:
      "1px solid rgba(51,65,85,0.8)"

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
</