import {
  useState
} from "react";

import imageCompression from "browser-image-compression";

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
  previewsDespues,
  setPreviewsDespues
] = useState([]);

const [

  loading,
  setLoading

] = useState(false);

const [
  procesandoFoto,
  setProcesandoFoto
] = useState(false);

/* =========================
   FOTO
========================= */

const tomarFotoDespues = async (e) => {

const archivo = e.target.files[0];

if (!archivo) return;

if (fotosDespues.length >= 4) {

return alert(
  "Máximo 4 fotos"
);

}

try {
setProcesandoFoto(true);
const compressedFile =
  await imageCompression(
    archivo,
    {
      maxSizeMB: 0.4,
      maxWidthOrHeight: 900,
      useWebWorker: true
    }
  );

const preview =
  URL.createObjectURL(
    compressedFile
  );

setFotosDespues((prev) => [
  ...prev,
  compressedFile
]);

setPreviewsDespues((prev) => [
  ...prev,
  preview
]);
setProcesandoFoto(false);

} catch (error) {

setProcesandoFoto(false);
console.log(error);

alert(
  "Error comprimiendo imagen"
);

}
};

/* =========================
   ELIMINAR
========================= */

const eliminarFoto = (index) => {

  URL.revokeObjectURL(
    previewsDespues[index]
  );

  setFotosDespues(
    fotosDespues.filter(
      (_, i) => i !== index
    )
  );

  setPreviewsDespues(
    previewsDespues.filter(
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

{
  procesandoFoto
    ? "Procesando..."
    : "📸 Tomar Foto"
}

<input
  type="file"

 accept="image/jpeg"

  capture="environment"
multiple={false}

  onChange={
    tomarFotoDespues
  }

disabled={procesandoFoto}

hidden
/>

</label>

<div
  className="upload-count"
>
  {fotosDespues.length}/4 fotos
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

 src={previewsDespues[index]}

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