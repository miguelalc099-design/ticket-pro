import { useState } from "react";
import { toast } from "react-toastify";

function ModalResolverSeguridad({

  equipo,

  onClose,

  recargarEquipos

}) {

const API =
  "https://ticket-pro-backend.onrender.com";

/* =========================
   STATES
========================= */

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

  fechaExpiracionPasswordERP,

  setFechaExpiracionPasswordERP

] = useState(

  equipo?.fechaExpiracionPasswordERP
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

  nuevaPasswordERP,

  setNuevaPasswordERP

] = useState("");

const [

  confirmarPasswordERP,

  setConfirmarPasswordERP

] = useState("");

const [

  observaciones,

  setObservaciones

] = useState("");

const [

  loading,

  setLoading

] = useState(false);

/* =========================
   VALIDACIÓN IMPORTANTE
========================= */

if (!equipo) return null;

/* =========================
   GUARDAR
========================= */

const guardar =
  async () => {

  try {

    setLoading(true);

    /* =========================
       VALIDAR WINDOWS
    ========================= */

    if (

      nuevaPasswordWindows &&

      nuevaPasswordWindows !==
        confirmarPasswordWindows

    ) {

      toast.error(
        "Passwords Windows no coinciden"
      );

      return;
    }

    if (

      nuevaPasswordWindows.length > 0 &&

      nuevaPasswordWindows.length < 6

    ) {

      toast.error(
        "Password Windows demasiado corto"
      );

      return;
    }

    /* =========================
       VALIDAR ERP
    ========================= */

    if (

      nuevaPasswordERP &&

      nuevaPasswordERP !==
        confirmarPasswordERP

    ) {

      toast.error(
        "Passwords ERP no coinciden"
      );

      return;
    }

    if (

      nuevaPasswordERP.length > 0 &&

      nuevaPasswordERP.length < 6

    ) {

      toast.error(
        "Password ERP demasiado corto"
      );

      return;
    }

    /* =========================
       BODY
    ========================= */

    const body = {

      fechaExpiracionAntivirus,

      fechaExpiracionPasswordWindows,

      fechaExpiracionPasswordERP,

      mfa,

      observaciones

    };

    /* =========================
       PASSWORD WINDOWS
    ========================= */

    if (nuevaPasswordWindows) {

      body.passwordWindows =
        nuevaPasswordWindows;

      body.passwordWindowsDesconocido =
        false;

      body.fechaCambioPasswordWindows =
        new Date();

    }

    /* =========================
       PASSWORD ERP
    ========================= */

    if (nuevaPasswordERP) {

      body.passwordERP =
        nuevaPasswordERP;

      body.passwordERPNoAplica =
        false;

      body.fechaCambioPasswordERP =
        new Date();

    }

    /* =========================
       REQUEST
    ========================= */

    const res =
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

    if (!res.ok) {

      throw new Error(
        "Error actualizando"
      );

    }

    toast.success(
      "Seguridad actualizada"
    );

    recargarEquipos();

    onClose();

  } catch (err) {

    console.log(err);

    toast.error(
      "Error actualizando seguridad"
    );

  } finally {

    setLoading(false);

  }

};

/* =========================
   JSX
========================= */

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

    maxWidth: "760px",

    maxHeight:
      "calc(100vh - 60px)",

    overflowY: "auto",

    padding: "32px",

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
    marginBottom: "10px"
  }}
>
  ✅ Resolver Seguridad
</h1>

<p
  style={{
    color: "#94a3b8",
    marginBottom: "30px"
  }}
>
  {equipo?.nombreEquipo}
</p>

<div
  style={{
    display: "grid",
    gap: "22px"
  }}
>

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
  ✅ Activado
</option>

<option value="no">
  ❌ Desactivado
</option>

</select>

</div>

<div>

<label className="label-pro">
  Expiración Antivirus
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

<div
  className="card-pro"
  style={{
    padding: "20px"
  }}
>

<h3
  style={{
    marginTop: 0,
    color: "#fff"
  }}
>
  🔐 Password Windows
</h3>

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

  value={
    nuevaPasswordWindows
  }

  onChange={(e) =>
    setNuevaPasswordWindows(
      e.target.value
    )
  }
/>

<input
  type="password"

  className="input-pro"

  placeholder="Confirmar password Windows"

  value={
    confirmarPasswordWindows
  }

  onChange={(e) =>
    setConfirmarPasswordWindows(
      e.target.value
    )
  }
/>

<input
  type="date"

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

<div
  className="card-pro"
  style={{
    padding: "20px"
  }}
>

<h3
  style={{
    marginTop: 0,
    color: "#fff"
  }}
>
  🏢 Password ERP
</h3>

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

  value={
    nuevaPasswordERP
  }

  onChange={(e) =>
    setNuevaPasswordERP(
      e.target.value
    )
  }
/>

<input
  type="password"

  className="input-pro"

  placeholder="Confirmar password ERP"

  value={
    confirmarPasswordERP
  }

  onChange={(e) =>
    setConfirmarPasswordERP(
      e.target.value
    )
  }
/>

<input
  type="date"

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

<div>

<label className="label-pro">
  Observaciones
</label>

<textarea
  className="input-pro"

  rows={4}

  value={observaciones}

  onChange={(e) =>
    setObservaciones(
      e.target.value
    )
  }

  placeholder="Detalles de actualización, renovación o cambios realizados..."
/>

</div>

<div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    gap: "14px",
    marginTop: "10px"
  }}
>

<button
  className="btn-pro btn-secondary"

  onClick={onClose}
>
  Cancelar
</button>

<button
  className="btn-pro"

  disabled={loading}

  onClick={guardar}
>
  {
    loading

    ? "Guardando..."

    : "💾 Guardar Resolución"
  }
</button>

</div>

</div>

</div>

</div>

);

}

export default ModalResolverSeguridad;