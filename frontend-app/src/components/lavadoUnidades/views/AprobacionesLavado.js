import {

  useEffect,
  useRef,
  useState

} from "react";

import SignatureCanvas
from "react-signature-canvas";

import "../styles/lavados.css";
import toast
from "react-hot-toast";

function AprobacionesLavado({

  onClose

}) {

/* =========================
   STATES
========================= */

const [

  lavados,
  setLavados

] = useState([]);

const [

  lavadoSeleccionado,
  setLavadoSeleccionado

] = useState(null);

const [

  comentario,
  setComentario

] = useState("");
const [

  imagenActiva,
  setImagenActiva

] = useState(null);

const [

  loadingAccion,
  setLoadingAccion

] = useState(false);

const firmaRef =
  useRef();
const token =
  localStorage.getItem(
    "token"
  );

const usuario =
  JSON.parse(
    localStorage.getItem(
      "user"
    )
  );

/* =========================
   OBTENER
========================= */

useEffect(() => {

  obtenerPendientes();

}, []);

const obtenerPendientes =
async () => {

  try {

    const res =
      await fetch(

"https://ticket-pro-backend.onrender.com/lavados"

      );

    const data =
      await res.json();

    const pendientes =
      data.filter(

        (l) =>
          l.estatus ===
          "EN_ESPERA"

      );

    setLavados(
      pendientes
    );

  } catch (err) {

    console.log(err);
  }

};



    /* =========================
   APROBAR
========================= */

const aprobarLavado =
async () => {

 if (
  firmaRef.current.isEmpty()
) {

  toast.error(
    "Debes firmar"
  );

  return;
}

  try {
setLoadingAccion(true);
    const firma =
      firmaRef.current
        .toDataURL();

const res = await fetch(

`https://ticket-pro-backend.onrender.com/lavados/aprobar/${lavadoSeleccionado._id}`,

    {

      method: "PUT",

     headers: {

  "Content-Type":
    "application/json",

  Authorization:
    `Bearer ${token}`

},

      body:
        JSON.stringify({

          estatus:
            "APROBADA",

          firmaSupervisor:
            firma,

          comentarioSupervisor:
            comentario,

          aprobadoPor:
  usuario?.username || "Supervisor"

        })

    });

const data =
  await res.json();

console.log(data);

if (!res.ok) {

  throw new Error(
    data.msg ||
    "Error backend"
  );

}

  toast.success(
  "Lavado aprobado"
);

    setLavadoSeleccionado(
      null
    );

    obtenerPendientes();

} catch (err) {

  console.log(err);

} finally {

  setLoadingAccion(false);
}

};

/* =========================
   RECHAZAR
========================= */

const rechazarLavado =
async () => {

if (!comentario) {

  toast.error(
    "Agrega comentario"
  );

  return;
}

try {

  setLoadingAccion(true);

  const res = await fetch(

`https://ticket-pro-backend.onrender.com/lavados/rechazar/${lavadoSeleccionado._id}`,

    {

      method: "PUT",

      headers: {

        "Content-Type":
          "application/json",

        Authorization:
          `Bearer ${token}`

      },

      body:
        JSON.stringify({

          estatus:
            "RECHAZADA",

          comentarioSupervisor:
            comentario,

          aprobadoPor:
            usuario?.username || "Supervisor"

        })

    }

  );

  const data =
    await res.json();

  console.log(data);

  console.log(res.status);

  toast.error(
    "Lavado rechazado"
  );

  setLavadoSeleccionado(
    null
  );

  obtenerPendientes();

} catch (err) {

  console.log(err);

} finally {

  setLoadingAccion(false);

}

};

/* =========================
   MODAL
========================= */

if (
  lavadoSeleccionado
) {

return (

<div
  className="lavados-container"
>

<button
  className="btn-lavado"

  onClick={() =>
    setLavadoSeleccionado(
      null
    )
  }
>
  ⬅ Volver
</button>

<div
  className="lavados-title"
>
  🔥 Aprobar Lavado
</div>

<div
  className="lavado-card"
>

<div
  style={{
    color: "#fff",
    fontSize: "20px",
    fontWeight: "700"
  }}
>
  🚛 {
    lavadoSeleccionado.numeroUnidad
  }
</div>

<div
  style={{
    color: "#94a3b8"
  }}
>
  👤 {
    lavadoSeleccionado.operadores?.join(", ")
  }
</div>

<div
  style={{
    color: "#cbd5e1"
  }}
>
  🧼 {
    lavadoSeleccionado.tiposLavado?.join(", ")
  }
</div>

{/* =========================
   EVIDENCIA
========================= */}

<div className="modal-gallery-section">

<div className="modal-gallery-title">

📸 Evidencia Fotográfica

</div>

<div className="modal-gallery">

{
[
...(lavadoSeleccionado.fotosAntes || []),
...(lavadoSeleccionado.fotosDespues || [])
].map((foto, index) => (

<img

  key={index}

  src={foto}

  alt="evidencia"

  className="modal-gallery-image"

  onClick={() =>
    setImagenActiva(
      foto
    )
  }

/>

))
}

</div>

</div>

{/* FIRMA */}

<div
  className="section-title"
>
  Firma Supervisor
</div>

<div
  style={{
    background: "white",
    borderRadius: "18px",
    overflow: "hidden"
  }}
>

<SignatureCanvas

  ref={firmaRef}

  penColor="black"

  canvasProps={{

    width: 350,
    height: 180,

    className:
      "signature-canvas"

  }}

/>

</div>

<button
  className="chip"

  onClick={() =>
    firmaRef.current.clear()
  }
>
  🧹 Limpiar Firma
</button>

{/* COMENTARIO */}

<textarea
  className="input-lavado"

  rows={4}

  placeholder="Comentario supervisor"

  value={comentario}

  onChange={(e) =>
    setComentario(
      e.target.value
    )
  }
/>

{/* BOTONES */}

<div
  style={{
    display: "grid",
    gap: "14px"
  }}
>

<button
  type="button"

  className="btn-lavado"

  onClick={
    aprobarLavado
  }

  disabled={
    loadingAccion
  }
>

{
loadingAccion

? "⏳ Procesando..."

: "✅ Aprobar"

}

</button>

<button
  type="button"

  className="btn-danger"

  onClick={
    rechazarLavado
  }

  disabled={
    loadingAccion
  }
>

{
loadingAccion

? "⏳ Procesando..."

: "❌ Rechazar"

}

</button>

</div>

</div>
{
imagenActiva && (

<div className="lightbox-overlay">

<button

  className="lightbox-close"

  onClick={() =>
    setImagenActiva(null)
  }
>
  ✕

</button>

<img

  src={imagenActiva}

  alt="fullscreen"

  className="lightbox-image"

/>

</div>

)
}
</div>

);

}

/* =========================
   LISTADO
========================= */

return (

<div
  className="lavados-container"
>
<button
  className="btn-lavado"

  onClick={onClose}
>
  ⬅ Volver
</button>
<div
  className="lavados-title"
>
  🔥 Aprobaciones
</div>

<div
  style={{
    display: "grid",
    gap: "18px"
  }}
>

{
lavados.map((lavado) => (

<div
  key={lavado._id}

  className="lavado-card"
>

<div
  style={{
    color: "#fff",
    fontWeight: "700",
    fontSize: "20px"
  }}
>
  🚛 {lavado.numeroUnidad}
</div>

<div
  style={{
    color: "#94a3b8"
  }}
>
  👤 {
    lavado.operadores?.join(", ")
  }
</div>

<div
  style={{
    color: "#cbd5e1"
  }}
>
  🧼 {
    lavado.tiposLavado?.join(", ")
  }
</div>

<button
  className="btn-lavado"

  onClick={() =>
    setLavadoSeleccionado(
      lavado
    )
  }
>
  👁 Revisar
</button>

</div>

))
}

</div>

</div>

);

}

export default AprobacionesLavado;