import {
  useState
} from "react";

import "../styles/lavados.css";

function CompletarLavado({

  lavado,
  onClose,
  onFinalizado

}) {

const [

  comentarios,
  setComentarios

] = useState(
  lavado.comentarios || ""
);

const [

  fotosDespues,
  setFotosDespues

] = useState([]);

const [

  loading,
  setLoading

] = useState(false);

/* =========================
   FOTO
========================= */

const tomarFotoDespues =
(e) => {

  const archivo =
    e.target.files[0];

  if (!archivo) return;

  if (
    fotosDespues.length >= 2
  ) {

    return alert(
      "Máximo 2 fotos"
    );
  }

  setFotosDespues([
    ...fotosDespues,
    archivo
  ]);
};

/* =========================
   ELIMINAR
========================= */

const eliminarFoto =
(index) => {

  setFotosDespues(

    fotosDespues.filter(
      (_, i) => i !== index
    )

  );

};

/* =========================
   FINALIZAR
========================= */

const finalizarLavado =
async () => {

  if (
    fotosDespues.length < 2
  ) {

    return alert(
      "Debes subir 2 fotos finales"
    );
  }

  try {

    setLoading(true);

    const formData =
      new FormData();

    formData.append(
      "comentarios",
      comentarios
    );

    formData.append(
      "estatus",
      "EN_ESPERA"
    );

    fotosDespues.forEach((foto) => {

      formData.append(
        "fotosDespues",
        foto
      );

    });

    const res =
      await fetch(

`https://ticket-pro-backend.onrender.com/lavados/completar/${lavado._id}`,

        {

          method: "PUT",

          body: formData

        }

      );

    await res.json();

    setLoading(false);

    alert(
      "✅ Lavado finalizado"
    );

    onFinalizado();

  } catch (err) {

    console.log(err);

    setLoading(false);
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

✅ Completar Lavado

</div>

<div className="lavado-card">

<div
  className="section-title"
>
  🚛 Unidad
</div>

<div
  style={{
    color: "#fff",
    marginBottom: "20px"
  }}
>
  {lavado.numeroUnidad}
</div>

<textarea

  className="input-lavado"

  rows={4}

  placeholder="Comentarios finales"

  value={comentarios}

  onChange={(e) =>
    setComentarios(
      e.target.value
    )
  }

/>

<div
  className="upload-card"
>

<div
  className="upload-title"
>
  📸 Fotos Después
</div>

<label
  className="camera-btn"
>

📸 Tomar Foto

<input
  type="file"

  accept="image/*"

  capture="environment"

  onChange={
    tomarFotoDespues
  }

  hidden
/>

</label>

<div
  className="upload-count"
>
  {fotosDespues.length}/2 fotos
</div>

{
fotosDespues.length > 0 && (

<div className="preview-grid">

{
fotosDespues.map(
(foto, index) => (

<div
  key={index}

  className="preview-item"
>

<img

  src={URL.createObjectURL(foto)}

  alt="preview"

  className="preview-image"

/>

<button

  className="preview-remove"

  onClick={() =>
    eliminarFoto(index)
  }
>
  ✕

</button>

</div>

))
}

</div>

)
}

</div>

<button

  className="btn-lavado"

  onClick={
    finalizarLavado
  }

  disabled={loading}
>

{
loading

? "Finalizando..."

: "✅ Finalizar Lavado"
}

</button>

</div>

</div>

);

}

export default CompletarLavado;