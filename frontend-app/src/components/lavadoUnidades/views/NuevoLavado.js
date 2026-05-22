import {

  useState

} from "react";

import "../styles/lavados.css";

function NuevoLavado() {

/* =========================
   STATES
========================= */

const [

  fechaLavado,
  setFechaLavado

] = useState("");

const [

  operador,
  setOperador

] = useState("");

const [

  supervisor,
  setSupervisor

] = useState("");

const [

  tipoUnidad,
  setTipoUnidad

] = useState("");

const [

  numeroUnidad,
  setNumeroUnidad

] = useState("");

const [

  tipoLavado,
  setTipoLavado

] = useState("");

const [

  comentarios,
  setComentarios

] = useState("");

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
   FOTOS
========================= */

const manejarFotosAntes =
(e) => {

  const archivos =
    Array.from(
      e.target.files
    );

  setFotosAntes(
    archivos
  );
};

const manejarFotosDespues =
(e) => {

  const archivos =
    Array.from(
      e.target.files
    );

  setFotosDespues(
    archivos
  );
};

/* =========================
   GUARDAR
========================= */

const guardarLavado =
async () => {

  if (

    fotosAntes.length < 2 ||

    fotosDespues.length < 2

  ) {

    return alert(
      "Debes agregar mínimo 2 fotos antes y después"
    );
  }

  try {

    setLoading(true);

    const body = {

      fechaLavado,

      operador,

      supervisor,

      tipoUnidad,

      numeroUnidad,

      tipoLavado,

      comentarios,

      fotosAntes: [],
      fotosDespues: []

    };

    const res =
      await fetch(

"http://localhost:3001/lavados",

      {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify(body)

      });

    await res.json();

    setLoading(false);

    alert(
      "✅ Lavado enviado"
    );

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

<div
  className="lavados-title"
>
  🚛 Nuevo Lavado
</div>

<div
  style={{

    display: "grid",

    gap: "18px"
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

{/* OPERADOR */}

<input
  className="input-lavado"

  placeholder="Operador"

  value={operador}

  onChange={(e) =>
    setOperador(
      e.target.value
    )
  }
/>

{/* SUPERVISOR */}

<input
  className="input-lavado"

  placeholder="Supervisor"

  value={supervisor}

  onChange={(e) =>
    setSupervisor(
      e.target.value
    )
  }
/>

{/* TIPO UNIDAD */}

<select
  className="input-lavado"

  value={tipoUnidad}

  onChange={(e) =>
    setTipoUnidad(
      e.target.value
    )
  }
>

<option value="">
  Tipo Unidad
</option>

<option value="Tracto">
  Tracto
</option>

<option value="Remolque">
  Remolque
</option>

</select>

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

{/* TIPO LAVADO */}

<select
  className="input-lavado"

  value={tipoLavado}

  onChange={(e) =>
    setTipoLavado(
      e.target.value
    )
  }
>

<option value="">
  Tipo Lavado
</option>

<option value="Lavada">
  Lavada
</option>

<option value="Detallado">
  Detallado
</option>

<option value="Barrida">
  Barrida
</option>

<option value="Fumigada">
  Fumigada
</option>

<option value="Pulida">
  Pulida
</option>

<option value="Limpieza interior">
  Limpieza interior
</option>

</select>

{/* COMENTARIOS */}

<textarea
  className="input-lavado"

  placeholder="Comentarios"

  rows={4}

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

<input
  type="file"

  accept="image/*"

  capture="environment"

  multiple

  onChange={
    manejarFotosAntes
  }
/>

<div
  className="upload-count"
>
  {fotosAntes.length}
  fotos seleccionadas
</div>

</div>

{/* FOTOS DESPUES */}

<div
  className="upload-card"
>

<div
  className="upload-title"
>
  📸 Fotos Después
</div>

<input
  type="file"

  accept="image/*"

  capture="environment"

  multiple

  onChange={
    manejarFotosDespues
  }
/>

<div
  className="upload-count"
>
  {fotosDespues.length}
  fotos seleccionadas
</div>

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

    : "🚛 Enviar Lavado"
  }
</button>

</div>

</div>

);

}

export default NuevoLavado;
