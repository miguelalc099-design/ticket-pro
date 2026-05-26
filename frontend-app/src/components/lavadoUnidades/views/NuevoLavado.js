import {
  useState
} from "react";

import "../styles/lavados.css";

function NuevoLavado({

  onClose

}) {

/* =========================
   STATES
========================= */

const [

  fechaLavado,
  setFechaLavado

] = useState("");

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

  fotosDespues,
  setFotosDespues

] = useState([]);

const [

  loading,
  setLoading

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

const tomarFotoAntes =
(e) => {

  const archivo =
    e.target.files[0];

  if (!archivo) return;

  if (
    fotosAntes.length >= 2
  ) {

    return alert(
      "Máximo 2 fotos antes"
    );
  }

  setFotosAntes([
    ...fotosAntes,
    archivo
  ]);
};

const tomarFotoDespues =
(e) => {

  const archivo =
    e.target.files[0];

  if (!archivo) return;

  if (
    fotosDespues.length >= 2
  ) {

    return alert(
      "Máximo 2 fotos después"
    );
  }

  setFotosDespues([
    ...fotosDespues,
    archivo
  ]);
};

/* =========================
   ELIMINAR FOTO
========================= */

const eliminarFotoAntes =
(index) => {

  setFotosAntes(

    fotosAntes.filter(
      (_, i) => i !== index
    )

  );

};

const eliminarFotoDespues =
(index) => {

  setFotosDespues(

    fotosDespues.filter(
      (_, i) => i !== index
    )

  );

};

/* =========================
   GUARDAR
========================= */

const guardarLavado =
async () => {

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
  "fechaLavado",
  fechaLavado
);

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

{/* FECHA */}

<input
  type="date"

  className="input-lavado"

  value={fechaLavado}

  onChange={(e) =>
    setFechaLavado(
      e.target.value
    )
  }
/>

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

{/* OPERADORES */}

<div>

<div
  className="section-title"
>
  Operadores
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
  Cantidad Operadores
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
  1 Operador
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
  2 Operadores
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

📸 Tomar Foto

<input
  type="file"

  accept="image/*"

  capture="environment"

  onChange={
    tomarFotoAntes
  }

  hidden
/>

</label>

<div
  className="upload-count"
>
  {fotosAntes.length}/2 fotos
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

  src={URL.createObjectURL(foto)}

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