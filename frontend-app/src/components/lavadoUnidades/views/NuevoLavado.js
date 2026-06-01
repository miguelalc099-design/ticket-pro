import {
  useState
} from "react";

import imageCompression from "browser-image-compression";

import "../styles/lavados.css";

function NuevoLavado({

  onClose,
  user

}) {

/* =========================
   STATES
========================= */

const [

  numeroUnidad,
  setNumeroUnidad

] = useState("");

const [

  comentarios,
  setComentarios

] = useState("");

const [

  tipoUnidad,
  setTipoUnidad

] = useState("");

const [

  operadores,
  setOperadores

] = useState([]);

const [

  cantidadOperadores,
  setCantidadOperadores

] = useState(1);

const [

  tiposLavado,
  setTiposLavado

] = useState([]);

const [

  fotosAntes,
  setFotosAntes

] = useState([]);

const [
  previewsAntes,
  setPreviewsAntes
] = useState([]);

const [

  fotosDespues,
  setFotosDespues

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
   OPCIONES
========================= */

const operadoresLista = [

  "Felipe",
  "Miguel",
  "Juan Jesus"

];

const servicios = [

  "Lavada",
  "Detallado",
  "Barrida",
  "Fumigada",
  "Pulida",
  "Limpieza interior"

];

/* =========================
   OPERADORES
========================= */

const toggleOperador =
(nombre) => {

  if (
    operadores.includes(nombre)
  ) {

    setOperadores(

      operadores.filter(
        (o) =>
          o !== nombre
      )

    );

  } else {

    setOperadores([
      ...operadores,
      nombre
    ]);

  }

};

/* =========================
   TIPOS LAVADO
========================= */

const toggleServicio =
(servicio) => {

  if (
    tiposLavado.includes(
      servicio
    )
  ) {

    setTiposLavado(

      tiposLavado.filter(
        (s) =>
          s !== servicio
      )

    );

  } else {

    setTiposLavado([
      ...tiposLavado,
      servicio
    ]);

  }

};

/* =========================
   FOTOS
========================= */

const tomarFotoAntes = async (e) => {

const archivo = e.target.files[0];

if (!archivo) return;

await new Promise(
  (resolve) =>
    setTimeout(resolve, 300)
);

if (fotosAntes.length >= 4) {

return alert(
  "Máximo 4 fotos antes"
);


}

try {

setProcesandoFoto(true);
const compressedFile =
  await imageCompression(
    archivo,
    {
  maxSizeMB: 0.25,
  maxWidthOrHeight: 700,
  useWebWorker: true
}
  );

const preview =
  URL.createObjectURL(
    compressedFile
  );

setFotosAntes((prev) => [
  ...prev,
  compressedFile
]);

setPreviewsAntes((prev) => [
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
   ELIMINAR FOTO
========================= */

const eliminarFotoAntes = (index) => {

  URL.revokeObjectURL(
    previewsAntes[index]
  );

  setFotosAntes(
    fotosAntes.filter(
      (_, i) => i !== index
    )
  );

  setPreviewsAntes(
    previewsAntes.filter(
      (_, i) => i !== index
    )
  );
};

/* =========================
   GUARDAR
========================= */

const guardarLavado =
async () => {


}

  if (
    operadores.length === 0
  ) {

    return alert(
      "Selecciona operadores"
    );
  }

  if (
    tiposLavado.length === 0
  ) {

    return alert(
      "Selecciona servicios"
    );
  }

  if (
    fotosAntes.length < 2
  ) {

    return alert(
      "Debes tomar 2 fotos antes"
    );
  }


  try {

    setLoading(true);

    const formData =
  new FormData();

/* =========================
   DATOS
========================= */

formData.append(
  "numeroUnidad",
  numeroUnidad
);

formData.append(
  "tipoUnidad",
  tipoUnidad
);

formData.append(
  "comentarios",
  comentarios
);

formData.append(
  "cantidadOperadores",
  cantidadOperadores
);

formData.append(
  "estatus",
  "EN_PROCESO"
);

formData.append(
  "creadoPor",
  user?.username || "Sistema"
);

/* =========================
   ARRAYS
========================= */

operadores.forEach((op) => {

  formData.append(
    "operadores",
    op
  );

});

tiposLavado.forEach((tipo) => {

  formData.append(
    "tiposLavado",
    tipo
  );

});

/* =========================
   FOTOS ANTES
========================= */

fotosAntes.forEach((foto) => {

  formData.append(
    "fotosAntes",
    foto
  );

});

/* =========================
   REQUEST
========================= */

const res =
  await fetch(

"https://ticket-pro-backend.onrender.com/lavados",

    {

      method: "POST",

      body: formData

    }

  );

    await res.json();

setLoading(false);

alert(
  "✅ Lavado enviado"
);

onClose();

  } catch (err) {

    console.log(err);

    setLoading(false);
  }

};

/* =========================
   JSX
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
  🚛 Nuevo Lavado
</div>

<div
  style={{

    display: "grid",

    gap: "20px"
  }}
>
{/* FECHA DE LAVADO */}
<div
  className="lavado-card"
  style={{
    padding: "12px",
    textAlign: "center"
  }}
>
  📅 Fecha del sistema:
  {" "}
  {new Date().toLocaleDateString("es-MX")}
</div>

{/* TIPO UNIDAD */}

<div>

<div
  className="section-title"
>
  Tipo Unidad
</div>

<div
  className="chips-grid"
>

<button
  className={
    tipoUnidad ===
    "TRACTO"

    ? "chip-active"

    : "chip"
  }

  onClick={() =>
    setTipoUnidad(
      "TRACTO"
    )
  }
>
  🚛 Tracto
</button>

<button
  className={
    tipoUnidad ===
    "REMOLQUE"

    ? "chip-active"

    : "chip"
  }

  onClick={() =>
    setTipoUnidad(
      "REMOLQUE"
    )
  }
>
  📦 Remolque
</button>

</div>

</div>

{/* NUMERO */}

<input
  className="input-lavado"

  placeholder="Número Unidad"

  value={numeroUnidad}

  onChange={(e) =>
    setNumeroUnidad(
      e.target.value
    )
  }
/>

{/* LAVADORES */}

<div>

<div
  className="section-title"
>
 Lavadores
</div>

<div
  className="chips-grid"
>

{
operadoresLista.map(
  (op) => (

<button
  key={op}

  className={
    operadores.includes(op)

    ? "chip-active"

    : "chip"
  }

  onClick={() =>
    toggleOperador(op)
  }
>
  👤 {op}
</button>

))
}

</div>

</div>

{/* CANTIDAD */}

<div>

<div
  className="section-title"
>
  Cantidad Lavadores
</div>

<div
  className="chips-grid"
>

<button
  className={
    cantidadOperadores === 1

    ? "chip-active"

    : "chip"
  }

  onClick={() =>
    setCantidadOperadores(1)
  }
>
 1 Lavador
</button>

<button
  className={
    cantidadOperadores === 2

    ? "chip-active"

    : "chip"
  }

  onClick={() =>
    setCantidadOperadores(2)
  }
>
  2 Lavadores
</button>

</div>

</div>

{/* SERVICIOS */}

<div>

<div
  className="section-title"
>
  Servicios
</div>

<div
  className="chips-grid"
>

{
servicios.map(
  (servicio) => (

<button
  key={servicio}

  className={
    tiposLavado.includes(
      servicio
    )

    ? "chip-active"

    : "chip"
  }

  onClick={() =>
    toggleServicio(
      servicio
    )
  }
>
  🧼 {servicio}
</button>

))
}

</div>

</div>

{/* COMENTARIOS */}

<textarea
  className="input-lavado"

  rows={4}

  placeholder="Comentarios"

  value={comentarios}

  onChange={(e) =>
    setComentarios(
      e.target.value
    )
  }
/>

{/* FOTOS ANTES */}

<div
  className="upload-card"
>

<div
  className="upload-title"
>
  📸 Fotos Antes
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

  onChange={tomarFotoAntes}

  disabled={procesandoFoto}

  hidden
/>
</label>

<div
  className="upload-count"
>
  {fotosAntes.length}/4 fotos
</div>
{
fotosAntes.length > 0 && (

<div className="preview-grid">

{
fotosAntes.map(
(foto, index) => (

<div
  key={index}

  className="preview-item"
>

<img

  src={previewsAntes[index]}

  alt="preview"

  className="preview-image"

/>

<button

  className="preview-remove"

  onClick={() =>
    eliminarFotoAntes(index)
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

{/* BOTON */}

<button
  className="btn-lavado"

  onClick={
    guardarLavado
  }

  disabled={loading}
>
  {
    loading

    ? "Guardando..."

    : "🚛 Iniciar Lavado"
  }
</button>

</div>

</div>

);

}

export default NuevoLavado;