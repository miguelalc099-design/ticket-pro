import {
  useState,
  useEffect,
  useRef
} from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import toast, { Toaster } from "react-hot-toast";
import ModalDuplicado from "./components/ciclicos/ModalDuplicado";
import ModalEditar from "./components/ciclicos/ModalEditar";
import TablaCapturas from "./components/ciclicos/TablaCapturas";
import KPIsResumen from "./components/ciclicos/KPIsResumen";

const API = "https://ticket-pro-backend.onrender.com";

function Ciclicos({ user }) {

  // ================= ESTADOS =================

  const [modo, setModo] = useState("lista");

  const [sku, setSku] = useState("");
  const [item, setItem] = useState(null);

  const [captura, setCaptura] = useState([]);
  const [conteo, setConteo] = useState("");

  const [ciclicos, setCiclicos] = useState([]);

  const [titulo, setTitulo] = useState("");
  const [fecha, setFecha] = useState("");

  const [ciclicoActivo, setCiclicoActivo] = useState(null);
const [busqueda, setBusqueda] = useState("");

const [resultados, setResultados] = useState([]);
const [filtroTabla, setFiltroTabla] =
  useState("todos");
const busquedaRef = useRef("");
const conteoInputRef = useRef(null);
const skuInputRef = useRef(null);
const [loading, setLoading] = useState(false);
const [duplicadoModal, setDuplicadoModal] =
  useState(false);

const [duplicadoData, setDuplicadoData] =
  useState(null);
const [editarModal, setEditarModal] =
  useState(false);

const [editarItem, setEditarItem] =
  useState(null);

const [nuevoConteoEdit, setNuevoConteoEdit] =
  useState("");
  // ================= CARGAR CICLICOS =================

const cargarCiclicos = async () => {
  try {
    const res = await axios.get(API + "/ciclicos");

    setCiclicos(res.data || []);

  } catch (err) {
    console.log(err);
  }
};

  // ================= CARGAR CAPTURAS =================

  const cargarCapturas = async (id) => {
    try {

      const res = await axios.get(
  API + "/ciclicos/" + id + "/capturas"
);

      setCaptura(res.data || []);

    } catch (err) {
      console.log(err);
    }
  };

  // ================= INIT =================

useEffect(() => {
  cargarCiclicos();
}, []);

  // ================= CREAR CICLICO =================

  const crearCiclico = async () => {

  setLoading(true);

    if (!titulo || !fecha) {
      toast.error("Completa título y fecha");
setLoading(false);
      return;
    }

    try {

      const res = await axios.post(API + "/ciclicos", {
        titulo,
        fecha,
        creadoPor: user.username
      });

      setCiclicoActivo(res.data);

      setCaptura([]);

      setModo("captura");

      cargarCiclicos();

   } catch (err) {

  console.log(err);

  toast.error("Error creando cíclico");

} finally {

  setLoading(false);
}
  };
// ================= SUBIR INVENTARIO =================

const subirExcel = async (e) => {

  try {

    const file = e.target.files[0];

    if (!file) return;

    const data = await file.arrayBuffer();

    const workbook = XLSX.read(data);

    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const json = XLSX.utils.sheet_to_json(sheet, {
      header: 1
    });

    console.log(json.slice(0, 5));

    const res = await axios.post(
      API + "/inventario/upload",
      {
        data: json
      }
    );

    console.log(res.data);

    toast.success("Inventario cargado 🔥");

  } catch (err) {

    console.log(err);

    toast.error("Error subiendo inventario");
  }
};

// ================= SUBIR CATALOGO =================

const subirCatalogo = async (e) => {

  try {

    const file = e.target.files[0];

    if (!file) return;

    const data = await file.arrayBuffer();

    const workbook = XLSX.read(data);

    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const json = XLSX.utils.sheet_to_json(sheet, {
      header: 1
    });

    console.log(json.slice(0, 5));

    const res = await axios.post(
      API + "/catalogo/upload",
      {
        data: json
      }
    );

    console.log(res.data);

   toast.success("Catálogo cargado 🔥");

  } catch (err) {

    console.log(err);

    toast.error("Error subiendo catálogo");
  }
};
// ================= BUSCAR SKU =================

const buscarParaCiclico = async () => {

  if (!sku) return;

  const codigo = String(sku).trim();

  try {

    // 🔥 INVENTARIO
    const inv = await axios.get(
      API + "/inventario/" + codigo
    );

    // 🔥 CATALOGO
    const cat = await axios.get(
      API + "/catalogo/" + codigo
    );

    // 🔥 NO EXISTE
   if (!inv.data && !cat.data) {

  toast.error("SKU no existe");

  setSku("");

  skuInputRef.current?.focus();

  return;
}

setItem({

  sku: codigo,

  // 🔥 INVENTARIO SI EXISTE
  // 🔥 SI NO, USA CATALOGO
  articulo:

    inv.data?.articulo ||

    cat.data?.articulo ||

    "Sin descripción",

  // 🔥 SOLO INVENTARIO TIJUANA
  existencia:

    inv.data?.existencia || 0,

  // 🔥 SOLO INVENTARIO
  costo:

    inv.data?.costo || 0,

  // 🔥 SOLO CATALOGO
  ubicacion:

    cat.data?.ubicacion || "N/A"
});
setTimeout(() => {

  conteoInputRef.current?.focus();

}, 100);

  } catch (err) {

    console.log(err);

   toast.error("Error conexión");
  }
};  


// ================= BUSQUEDA INTELIGENTE =================

const buscarDescripcion = async (texto) => {

  setBusqueda(texto);
busquedaRef.current = texto;

  // 🔥 MUY CORTO
 if (texto.trim().length < 2) {

  setResultados([]);

  return;
}

  try {



const res = await axios.get(
  API + "/buscar?q=" + texto
);

// 🔥 SI EL INPUT YA CAMBIÓ
// IGNORA RESPUESTA VIEJA


if (busquedaRef.current !== texto) {
  return;
}

setResultados(res.data);
  } catch (err) {

    console.log(err);
  }
};

  // ================= AGREGAR =================

  const agregar = async () => {

  setLoading(true);

    if (!item) {

  setLoading(false);

  return;
}

const conteoFinal =

  conteo === ""
    ? 0
    : Number(conteo);

    try {

      const nuevo = {
        sku: item.sku,
        articulo: item.articulo,

        sistema: item.existencia || 0,

conteo: conteoFinal,

diferencia:
  conteoFinal -
  Number(item.existencia || 0),

        ubicacion: item.ubicacion || "-",

costo: item.costo || 0,

ajuste:

(conteoFinal -
Number(item.existencia || 0))

  * Number(item.costo || 0),

      };

      await axios.post(
  API + "/ciclicos/" + ciclicoActivo._id + "/captura",
  nuevo
);

await cargarCapturas(
  ciclicoActivo._id
);

await cargarCiclicos();

setSku("");

setItem(null);

setConteo("");

setDuplicadoModal(false);

setDuplicadoData(null);

skuInputRef.current?.focus();

setLoading(false);
 } catch (err) {

  console.log(err);

  // 🔥 DUPLICADO
setLoading(false);
 if (
  err.response?.status === 409
) {

  const existente =
    err.response.data.captura;

  setDuplicadoData({

    existente,

    conteoNuevo: conteoFinal
  });

  setDuplicadoModal(true);

  return;
}

toast.error("Error agregando");
}
  };
const manejarDuplicado = async (

  tipo
) => {
setLoading(true);
  try {

    const existente =
      duplicadoData.existente;

    let nuevoConteo =
      existente.conteo;

    // 🔥 SUMAR
    if (tipo === "sumar") {

      nuevoConteo =

        Number(existente.conteo || 0) +

        Number(
          duplicadoData.conteoNuevo || 0
        );
    }

    // 🔥 REEMPLAZAR
    if (tipo === "reemplazar") {

      nuevoConteo = Number(
        duplicadoData.conteoNuevo || 0
      );
    }

    await axios.put(

      API + "/capturas/" + existente._id,

      {
        conteo: nuevoConteo
      }
    );

    toast.success(
      "SKU actualizado 🔥"
    );

await cargarCapturas(
  ciclicoActivo._id
);

await cargarCiclicos();

setSku("");

setItem(null);

setConteo("");

setDuplicadoModal(false);

setDuplicadoData(null);

skuInputRef.current?.focus();

setLoading(false);

 } catch (err) {

  console.log(err);

  setDuplicadoModal(false);

  setDuplicadoData(null);

  setLoading(false);

  toast.error(
    "Error actualizando"
  );
}
};
  // ================= ABRIR CICLICO =================
const guardarEdicion = async () => {

  try {

    setLoading(true);

    await axios.put(

      API + "/capturas/" + editarItem._id,

      {
        conteo: Number(
          nuevoConteoEdit || 0
        )
      }
    );

    toast.success(
      "Conteo actualizado 🔥"
    );

    await cargarCapturas(
      ciclicoActivo._id
    );

    await cargarCiclicos();

    setEditarModal(false);

    setEditarItem(null);

    setNuevoConteoEdit("");
skuInputRef.current?.focus();

  } catch (err) {

    console.log(err);

    toast.error(
      "Error actualizando"
    );

  } finally {

    setLoading(false);
  }
};
  const abrirCiclico = async (c) => {

    setCiclicoActivo(c);

    await cargarCapturas(c._id);

    setModo("captura");
  };

  // ================= CERRAR CICLICO =================

  const cerrarCiclico = async () => {

  if (!ciclicoActivo) return;

  try {

    await axios.put(
  API + "/ciclicos/" + ciclicoActivo._id + "/cerrar"
);

    toast.success("Cíclico cerrado");

    await cargarCiclicos();

    setModo("lista");

    setCaptura([]);

    setCiclicoActivo(null);

  } catch (err) {
    console.log(err);
  }
};
const obtenerDiferencia = (i) => {

  return (

    Number(i.conteo || 0) -

    Number(i.sistema || 0)
  );
};

// ================= RESUMEN EJECUTIVO =================

const totalSKUs = captura.length;

const totalDiferencias = captura.filter(
  i => obtenerDiferencia(i) !== 0
).length;

const sobrantes = captura
  .filter(i =>
    (
      obtenerDiferencia(i) *
      Number(i.costo || 0)
    ) > 0
  )
  .reduce(
    (acc, i) =>
      acc +
      (
        obtenerDiferencia(i) *
        Number(i.costo || 0)
      ),
    0
  );

const faltantes = captura
  .filter(i =>
    (
      obtenerDiferencia(i) *
      Number(i.costo || 0)
    ) < 0
  )
  .reduce(
    (acc, i) =>
      acc +
      (
        obtenerDiferencia(i) *
        Number(i.costo || 0)
      ),
    0
  );

const ajusteTotal = captura
  .reduce(
    (acc, i) =>
      acc +
      (
        obtenerDiferencia(i) *
        Number(i.costo || 0)
      ),
    0
  );
// ================= FILTROS TABLA =================

const capturaFiltrada = captura.filter(i => {

  // TODOS
  if (filtroTabla === "todos") {
    return true;
  }

  // SOLO DIFERENCIAS
  if (filtroTabla === "diferencias") {
    return i.diferencia !== 0;
  }

  // SOBRANTES
  if (filtroTabla === "sobrantes") {
    return i.diferencia > 0;
  }

  // FALTANTES
  if (filtroTabla === "faltantes") {
    return i.diferencia < 0;
  }

  return true;
});

  // ================= RENDER =================

  return (
<div>

  {/* MAIN */}

  <div className="main-pro">
<Toaster
  position="top-right"
/>

<div>

  <div className="top-card">

  <div className="top-row">

    <div className="ciclico-header">

      <div className="ciclico-icon">
        
      </div>

      <div>

        <h1 className="ciclico-title">
          📦 Módulo Cíclicos
        </h1>

      <p
  style={{

    color: "#94a3b8",

    marginTop: "14px",

    fontSize: "15px",

    letterSpacing: "0.5px",

    lineHeight: "1.6",

    marginBottom: 0
  }}
>
  Control inteligente de inventario
</p>

      </div>

    </div>

  </div>

</div>
<div style={{ marginBottom: "45px" }} />

      {/* ================= LISTA ================= */}

      {modo === "lista" && (
        <>
{/* HEADER */}

  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "18px",
      marginBottom: "35px"
    }}
  >

    <div
      style={{
        width: "70px",
        height: "70px",
        borderRadius: "22px",

        background:
          "linear-gradient(145deg,#2563eb,#7c3aed)",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        fontSize: "34px",

        boxShadow:
          "0 10px 25px rgba(59,130,246,0.35)"
      }}
    >
      🛠
    </div>

    <div>

      <h2
        style={{
          margin: 0,
          fontSize: "34px",
          color: "#fff"
        }}
      >
        Herramientas
      </h2>

      <p
        style={{
          marginTop: "6px",
          color: "#94a3b8",
          fontSize: "16px"
        }}
      >
        Administra inventario y catálogo
      </p>

    </div>

  </div>

  {/* INVENTARIO */}

  <div
    style={{
      display: "grid",

      gridTemplateColumns:
  "repeat(auto-fit, minmax(320px, 1fr))",

      gap: "25px",

      background:
        "rgba(15,23,42,0.7)",

      border:
        "1px solid #1e293b",

      borderRadius: "24px",

      padding: "25px",

      marginBottom: "25px"
    }}
  >

    {/* INFO */}

    <div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          marginBottom: "20px"
        }}
      >

        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "18px",

            background:
              "linear-gradient(145deg,#2563eb,#1d4ed8)",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            fontSize: "28px"
          }}
        >
          📥
        </div>

        <div>

          <h3
            style={{
              margin: 0,
              color: "#fff",
              fontSize: "28px"
            }}
          >
            Actualizar Inventario
          </h3>

          <p
            style={{
              marginTop: "8px",
              color: "#94a3b8"
            }}
          >
            Carga existencias y costos
          </p>

        </div>

      </div>

      <div
        style={{
          background:
            "rgba(37,99,235,0.12)",

          border:
            "1px solid rgba(59,130,246,0.25)",

          borderRadius: "14px",

          padding: "14px",

          color: "#93c5fd",

          fontSize: "15px"
        }}
      >
        ℹ Formatos soportados:
        .xlsx / .xls
      </div>

    </div>

    {/* BOTON */}

    <div
      style={{
        border:
          "2px dashed rgba(59,130,246,0.5)",

        borderRadius: "24px",

        display: "flex",

        flexDirection: "column",

        alignItems: "center",

        justifyContent: "center",

        padding: "30px"
      }}
    >

      <div
        style={{
          fontSize: "55px",
          marginBottom: "15px"
        }}
      >
        ☁
      </div>

      <p
        style={{
          color: "#fff",
          fontSize: "20px",
          fontWeight: "bold",
          marginBottom: "10px"
        }}
      >
        Selecciona tu archivo
      </p>

     <label
  style={{
    background:
      "linear-gradient(145deg,#2563eb,#1d4ed8)",

    color: "#fff",

    padding: "14px 28px",

    borderRadius: "14px",

    cursor: "pointer",

    fontWeight: "bold",

    fontSize: "17px",

    boxShadow:
      "0 10px 20px rgba(37,99,235,0.35)",

    transition: "0.2s"
  }}
>
  ⬆ Seleccionar archivo

  <input
    type="file"
    onChange={subirExcel}

    style={{
      display: "none"
    }}
  />
</label>

    </div>

  </div>

  {/* CATALOGO */}

  <div
    style={{
      display: "grid",

      gridTemplateColumns:
  "repeat(auto-fit, minmax(320px, 1fr))",

      gap: "25px",

      background:
        "rgba(15,23,42,0.7)",

      border:
        "1px solid #1e293b",

      borderRadius: "24px",

      padding: "25px"
    }}
  >

    {/* INFO */}

    <div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          marginBottom: "20px"
        }}
      >

        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "18px",

            background:
              "linear-gradient(145deg,#9333ea,#7e22ce)",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            fontSize: "28px"
          }}
        >
          📋
        </div>

        <div>

          <h3
            style={{
              margin: 0,
              color: "#fff",
              fontSize: "28px"
            }}
          >
            Actualizar Catálogo
          </h3>

          <p
            style={{
              marginTop: "8px",
              color: "#94a3b8"
            }}
          >
            Carga ubicaciones y artículos
          </p>

        </div>

      </div>

      <div
        style={{
          background:
            "rgba(147,51,234,0.12)",

          border:
            "1px solid rgba(168,85,247,0.25)",

          borderRadius: "14px",

          padding: "14px",

          color: "#d8b4fe",

          fontSize: "15px"
        }}
      >
        ℹ Formatos soportados:
        .xlsx / .xls
      </div>

    </div>

    {/* BOTON */}

    <div
      style={{
        border:
          "2px dashed rgba(168,85,247,0.45)",

        borderRadius: "24px",

        display: "flex",

        flexDirection: "column",

        alignItems: "center",

        justifyContent: "center",

        padding: "30px"
      }}
    >

      <div
        style={{
          fontSize: "55px",
          marginBottom: "15px"
        }}
      >
        ☁
      </div>

      <p
        style={{
          color: "#fff",
          fontSize: "20px",
          fontWeight: "bold",
          marginBottom: "10px"
        }}
      >
        Selecciona tu archivo
      </p>

      <label
  style={{
    background:
      "linear-gradient(145deg,#9333ea,#7e22ce)",

    color: "#fff",

    padding: "14px 28px",

    borderRadius: "14px",

    cursor: "pointer",

    fontWeight: "bold",

    fontSize: "17px",

    boxShadow:
      "0 10px 20px rgba(147,51,234,0.35)",

    transition: "0.2s"
  }}
>
  ⬆ Seleccionar archivo

  <input
    type="file"
    onChange={subirCatalogo}

    style={{
      display: "none"
    }}
  />
</label>

    </div>

  </div>

<div style={{ marginBottom: "20px" }}>

  <input
    className="input-pro"
    type="text"
    placeholder="🔍 Buscar SKU o descripción..."
    value={busqueda}
    onChange={(e) =>
      buscarDescripcion(e.target.value)
    }
  />

</div>

{resultados.length > 0 && (

<div
  style={{
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginTop: "15px",
  marginBottom: "35px",
  position: "relative",
  zIndex: 20
}}
>

 {resultados.map((item, index) => (
    <div
      key={index}
      className="card-pro"
      style={{
        padding: "18px"
      }}
    >
      <div>
        <strong>{item.sku}</strong>
      </div>

      <div>
        {item.articulo}
      </div>

      <div>
        📍 {item.ubicacion || "Sin ubicación"}
      </div>

      <div>
        📦 {item.existencia}
      </div>

    </div>
  ))}

</div>
)}
         <button
  className="btn-pro"
  onClick={() => setModo("nuevo")}
>
            ➕ Nuevo Cíclico
          </button>

          <br /><br />

          {ciclicos.length === 0 && (
            <p>No hay cíclicos</p>
          )}

          {ciclicos.map((c) => (

            <div
  key={c._id}
  className="card-pro"
  style={{
    padding: "28px",
    marginBottom: "20px"
  }}
>

              <h3>{c.folio}</h3>

              <p><b>Título:</b> {c.titulo}</p>

              <p><b>Fecha:</b> {c.fecha}</p>
<p>
  <b>Creado por:</b> {c.creadoPor || "N/A"}
</p>

              <p><b>Estado:</b> {c.estado}</p>

              <p>
                <b>SKUs:</b> {c.totalCapturados}
              </p>

              <p>
                <b>Diferencias:</b> {c.diferencias}
              </p>

             <button
  className="btn-pro"
  onClick={() => abrirCiclico(c)}
>
                {c.estado === "Abierto"
                  ? "▶ Continuar"
                  : "👁 Ver"}
              </button>
<button
  className="btn-pro btn-secondary"
  style={{ marginLeft: "10px" }}

  onClick={async () => {

    try {

      const res = await axios.get(
        API + "/ciclicos/" + c._id + "/excel"
      );

     const datos = [
  [],
  ["FOLIO", c.folio],
  ["TÍTULO", c.titulo],
  ["FECHA", c.fecha],
  ["CREADO POR", c.creadoPor],
  ["ESTADO", c.estado],

  [],

 ["RESUMEN"],

["Total SKUs", c.totalCapturados],

["Diferencias", c.diferencias],

["Ajuste Total $",
  res.data.reduce(
    (acc, i) =>
      acc + Number(i.ajuste || 0),
    0
  ).toFixed(2)
],

[],

  [
    "SKU",
    "Artículo",
    "Ubicación",
    "Sistema",
    "Conteo",
    "Diferencia",
    "Costo",
    "Ajuste"
  ],

  ...res.data.map(i => ([
    i.sku,
    i.articulo,
    i.ubicacion,
    i.sistema,
    i.conteo,
    i.diferencia,

    Number(i.costo || 0).toFixed(2),

    Number(i.ajuste || 0).toFixed(2)
  ]))
];

      const ws = XLSX.utils.aoa_to_sheet(datos);
ws["!cols"] = [
  { wch: 18 },
  { wch: 45 },
  { wch: 20 },
  { wch: 12 },
  { wch: 12 },
  { wch: 14 },
  { wch: 14 },
  { wch: 16 }
];

ws["!autofilter"] = {
  ref: "A12:H12"
};

      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        wb,
        ws,
        "Ciclico"
      );

      XLSX.writeFile(
        wb,
        `${c.folio}.xlsx`
      );

    } catch (err) {

      console.log(err);

      toast.error("Error exportando");
    }
  }}
>
  📥 Excel
</button>

            </div>
          ))}

        </>
      )}

      {/* ================= NUEVO ================= */}

      {modo === "nuevo" && (
        <>

          <h3>➕ Nuevo Cíclico</h3>

<input
  className="input-pro"
  placeholder="📝 Título del cíclico"
  value={titulo}
  onChange={(e) =>
    setTitulo(e.target.value)
  }
/>

<br /><br />

<input
  className="input-pro"
  type="date"
  value={fecha}
  onChange={(e) =>
    setFecha(e.target.value)
  }
/>

<br /><br />

         <button
  className="btn-pro"
  onClick={crearCiclico}
  disabled={loading}
>
  {loading
    ? "⏳ Creando..."
    : "🚀 Iniciar Cíclico"}
</button>

          <button
  className="btn-pro btn-secondary"
  style={{ marginLeft: "10px" }}

            onClick={() => setModo("lista")}
          >
            Cancelar
          </button>

        </>
      )}

      {/* ================= CAPTURA ================= */}

      {modo === "captura" && ciclicoActivo && (
        <>

          <h3>
            {ciclicoActivo.folio}
          </h3>

          <p>
            <b>{ciclicoActivo.titulo}</b>
          </p>

          <p>
            Estado: {ciclicoActivo.estado}
          </p>

          <hr />
<div style={{ marginTop: "30px" }} />

          {ciclicoActivo.estado === "Abierto" && (
            <>

<input
ref={skuInputRef}
  className="input-pro"
  placeholder="🔍 Escanea o escribe SKU"
  value={sku}
  onChange={(e) => setSku(e.target.value)}
  onKeyDown={(e) => {

    if (e.key === "Enter") {
      buscarParaCiclico();
    }
  }}
/>

<div style={{ marginTop: "20px" }} />

<input
  className="input-pro"
  type="text"
  placeholder="🔍 Buscar descripción..."
  value={busqueda}
  onChange={(e) =>
    buscarDescripcion(e.target.value)
  }
/>

{resultados.length > 0 && (
<div
  style={{
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginTop: "15px",
  marginBottom: "60px",
  position: "relative",
  zIndex: 20
}}
>

  {resultados.map((r, index) => (

    <div
      key={index}

onClick={async () => {

  try {

    // 🔥 INVENTARIO REAL
    const inv = await axios.get(
      API + "/inventario/" + r.sku
    );

    // 🔥 CATALOGO
    const cat = await axios.get(
      API + "/catalogo/" + r.sku
    );

    setSku(r.sku);

    setItem({

      sku: r.sku,

      articulo:
        inv.data?.articulo ||
        r.articulo,

      // 🔥 SIEMPRE INVENTARIO
      existencia:
        inv.data?.existencia || 0,

      // 🔥 SIEMPRE INVENTARIO
      costo:
        inv.data?.costo || 0,

      // 🔥 SOLO CATALOGO
      ubicacion:
        cat.data?.ubicacion || "N/A"
    });

    setResultados([]);

    setBusqueda("");
setTimeout(() => {

  conteoInputRef.current?.focus();

}, 100);

  } catch (err) {

    console.log(err);
  }
}}

className="card-pro"

style={{
  padding: "18px",
  cursor: "pointer"
}}
    >

      <div>
        <strong>{r.sku}</strong>
      </div>

      <div>{r.articulo}</div>

      <div>
        📍 {r.ubicacion || "Sin ubicación"}
      </div>

      <div>
        📦 {r.existencia}
      </div>

    </div>
  ))}

</div>
)}
              {item && (
                <div
                  style={{
                    marginTop: "20px",
                    marginBottom: "20px"
                  }}
                >

                  <p>
                    <b>Artículo:</b> {item.articulo}
                  </p>

                  <p>
                    <b>Sistema:</b> {item.existencia || 0}
                  </p>

                  <p>
                    <b>Ubicación:</b> {item.ubicacion || "N/A"}
                  </p>
<button
  className="btn-pro btn-secondary"

  onClick={() => {

  setDuplicadoModal(false);

  setDuplicadoData(null);

  setSku("");

  setItem(null);

  setConteo("");

  skuInputRef.current?.focus();
}}

  style={{
    marginBottom: "15px"
  }}
>
  🗑 Limpiar
</button>
<div style={{ marginTop: "25px" }} />

<input
ref={conteoInputRef}
  className="input-pro"
  type="number"
  placeholder="🔢 Conteo"
  value={conteo}
  onChange={(e) =>
    setConteo(e.target.value)
  }
  onKeyDown={(e) => {

    if (e.key === "Enter") {
      agregar();
    }
  }}
/>

<div style={{ marginTop: "18px" }} />

<button
  className="btn-pro"
  onClick={agregar}
  disabled={loading}
>
  {loading
    ? "⏳ Guardando..."
    : "Agregar"}
</button>

                </div>
              )}

            </>
          )}
{captura.length > 0 && (

<KPIsResumen
  totalSKUs={totalSKUs}
  totalDiferencias={totalDiferencias}
  sobrantes={sobrantes}
  faltantes={faltantes}
  ajusteTotal={ajusteTotal}
  setFiltroTabla={setFiltroTabla}
/>

)}

{captura.length > 0 && (

<TablaCapturas
  capturaFiltrada={capturaFiltrada}
  ciclicoActivo={ciclicoActivo}
  setEditarItem={setEditarItem}
  setNuevoConteoEdit={setNuevoConteoEdit}
  setEditarModal={setEditarModal}
  toast={toast}
  axios={axios}
  API={API}
  setCaptura={setCaptura}
  cargarCiclicos={cargarCiclicos}
/>

)}

          <br />

          <div
  style={{
    marginTop: "30px",
    display: "flex",
    gap: "12px",
    flexWrap: "wrap"
  }}
>

  {ciclicoActivo.estado === "Abierto" && (
    <button
      className="btn-pro btn-danger"
      onClick={cerrarCiclico}
    >
      ✅ Finalizar Cíclico
    </button>
  )}

  <button
    className="btn-pro btn-secondary"
    onClick={() => {
      setModo("lista");
      setItem(null);
    }}
  >
    ← Volver
  </button>

</div>

        </>
      )}

           </div>
      </div>
<ModalEditar
  editarModal={editarModal}
  editarItem={editarItem}
  nuevoConteoEdit={nuevoConteoEdit}
  setNuevoConteoEdit={setNuevoConteoEdit}
  guardarEdicion={guardarEdicion}
  loading={loading}
  setEditarModal={setEditarModal}
  setEditarItem={setEditarItem}
  skuInputRef={skuInputRef}
/>

<ModalDuplicado
  duplicadoModal={duplicadoModal}
  duplicadoData={duplicadoData}
  manejarDuplicado={manejarDuplicado}
  setDuplicadoModal={setDuplicadoModal}
  setDuplicadoData={setDuplicadoData}
  setSku={setSku}
  setItem={setItem}
  setConteo={setConteo}
  skuInputRef={skuInputRef}
/>
    </div>

);
}

export default Ciclicos;