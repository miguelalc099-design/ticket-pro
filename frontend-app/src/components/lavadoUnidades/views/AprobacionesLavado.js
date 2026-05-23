import {

  useEffect,
  useRef,
  useState

} from "react";

import SignatureCanvas
from "react-signature-canvas";

import "../styles/lavados.css";

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

const firmaRef =
  useRef();

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
    !firmaRef.current
      ?.toDataURL()
  ) {

    return alert(
      "Debes firmar"
    );
  }

  try {

    const firma =
      firmaRef.current
        .toDataURL();

    await fetch(

`https://ticket-pro-backend.onrender.com/lavados/${lavadoSeleccionado._id}`,

    {

      method: "PUT",

      headers: {

        "Content-Type":
          "application/json"

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
            "Supervisor"

        })

    });

    alert(
      "✅ Lavado aprobado"
    );

    setLavadoSeleccionado(
      null
    );

    obtenerPendientes();

  } catch (err) {

    console.log(err);
  }

};

/* =========================
   RECHAZAR
========================= */

const rechazarLavado =
async () => {

  if (!comentario) {

    return alert(
      "Debes agregar comentario"
    );
  }

  try {

  await fetch(
`https://ticket-pro-backend.onrender.com/lavados/${lavadoSeleccionado._id}`,

    {

      method: "PUT",

      headers: {

        "Content-Type":
          "application/json"

      },

      body:
        JSON.stringify({

          estatus:
            "RECHAZADA",

          comentarioSupervisor:
            comentario

        })

    });

    alert(
      "❌ Lavado rechazado"
    );

    setLavadoSeleccionado(
      null
    );

    obtenerPendientes();

  } catch (err) {

    console.log(err);
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
  className="btn-lavado"

  onClick={
    aprobarLavado
  }
>
  ✅ Aprobar
</button>

<button
  className="btn-danger"

  onClick={
    rechazarLavado
  }
>
  ❌ Rechazar
</button>

</div>

</div>

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