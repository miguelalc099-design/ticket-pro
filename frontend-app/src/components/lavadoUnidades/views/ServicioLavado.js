import { useEffect, useState } from "react";

import "../styles/lavados.css";

function ServicioLavado({ onClose }) {

const [servicios, setServicios] =
  useState([]);

const [nombre, setNombre] =
  useState("");

const [precio, setPrecio] =
  useState("");

const [loading, setLoading] =
  useState(false);
const [editandoId, setEditandoId] =
  useState(null);

const API =
"https://ticket-pro-backend.onrender.com/servicios-lavado";

/* =========================
   CARGAR
========================= */

const cargarServicios =
async () => {

  try {

    const res =
      await fetch(API);

    const data =
      await res.json();

    setServicios(data);

  } catch (err) {

    console.log(err);

  }

};

useEffect(() => {

  cargarServicios();

}, []);

/* =========================
   CREAR
========================= */

const crearServicio =
async () => {

  if (!nombre.trim()) {

    return alert(
      "Captura un nombre"
    );

  }

  if (!precio) {

    return alert(
      "Captura precio"
    );

  }

  try {

    setLoading(true);

    const res =
      await fetch(API, {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({

          nombre,

          precio:
            Number(precio)

        })

      });

    const data =
      await res.json();

    console.log(data);

    setNombre("");
    setPrecio("");

    await cargarServicios();

  } catch (err) {

    console.log(err);

  } finally {

    setLoading(false);

  }

};

/* =========================
   EDITAR
========================= */

const editarServicio =
(servicio) => {

  setEditandoId(
    servicio._id
  );

  setNombre(
    servicio.nombre
  );

  setPrecio(
    servicio.precio
  );

};

/* =========================
   GUARDAR EDICION
========================= */

const guardarEdicion =
async () => {

  try {

    setLoading(true);

    await fetch(

      `${API}/${editandoId}`,

      {

        method: "PUT",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({

          nombre,

          precio:
            Number(precio)

        })

      }

    );

    setEditandoId(null);

    setNombre("");

    setPrecio("");

    await cargarServicios();

  } catch (err) {

    console.log(err);

  } finally {

    setLoading(false);

  }

};

/* =========================
   DESACTIVAR
========================= */

const eliminarServicio =
async (id) => {

  const confirmar =
    window.confirm(
      "¿Desactivar servicio?"
    );

  if (!confirmar) return;

  try {

    await fetch(

      `${API}/${id}`,

      {
        method: "DELETE"
      }

    );

    cargarServicios();

  } catch (err) {

    console.log(err);

  }

};

return (

<div className="lavados-container">

<button
  className="btn-lavado"
  onClick={onClose}
>
  ⬅ Volver
</button>

<div className="lavados-title">
  🧼 Catálogo Servicios
</div>

<div
  className="lavado-card"
  style={{
    display: "grid",
    gap: "12px"
  }}
>

<input
  className="input-lavado"
  placeholder="Nombre servicio"
  value={nombre}
  onChange={(e) =>
    setNombre(
      e.target.value
    )
  }
/>

<input
  className="input-lavado"
  type="number"
  placeholder="Precio"
  value={precio}
  onChange={(e) =>
    setPrecio(
      e.target.value
    )
  }
/>

<button
  className="btn-lavado"

  onClick={

    editandoId

    ? guardarEdicion

    : crearServicio

  }

  disabled={loading}
>
{
loading

? "Guardando..."

: editandoId

? "💾 Guardar Cambios"

: "➕ Crear Servicio"
}
</button>

</div>

<div
  style={{
    display: "grid",
    gap: "12px",
    marginTop: "20px"
  }}
>

{
servicios.map(
(servicio) => (

<div
  key={servicio._id}
  className="lavado-card"
>

<div
  style={{
    display: "flex",
    justifyContent:
      "space-between",
    alignItems:
      "center",
    flexWrap: "wrap",
    gap: "10px"
  }}
>

<div>

<div
  style={{
    color: "#fff",
    fontWeight: "700"
  }}
>
  {servicio.nombre}
</div>

<div
  style={{
    color: "#60a5fa"
  }}
>
  $
  {servicio.precio}
</div>

</div>

<div
  style={{
    display: "flex",
    gap: "10px"
  }}
>

<button
  className="btn-lavado secondary"

  onClick={() =>
    editarServicio(
      servicio
    )
  }
>
  ✏ Editar
</button>

<button
  className="btn-danger"

  onClick={() =>
    eliminarServicio(
      servicio._id
    )
  }
>
  ❌ Desactivar
</button>

</div>

</div>

</div>

))
}

{
servicios.length === 0 && (

<div className="lavado-card">

No existen servicios.

</div>

)
}

</div>

</div>

);

}

export default ServicioLavado;