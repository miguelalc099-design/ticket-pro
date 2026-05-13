import {
  useState,
  useEffect,
  useRef
} from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import toast, { Toaster } from "react-hot-toast";

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
const skuInputRef = useRef(null);
const [loading, setLoading] = useState(false);
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

    const busquedaActual = texto;

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

    if (!item || conteo === "") return;

    try {

      const nuevo = {
        sku: item.sku,
        articulo: item.articulo,

        sistema: item.existencia || 0,

        conteo: Number(conteo),

        diferencia:
          Number(conteo) - Number(item.existencia || 0),

        ubicacion: item.ubicacion || "-",

costo: item.costo || 0,

ajuste:

  (Number(conteo) -
  Number(item.existencia || 0))

  * Number(item.costo || 0),

      };

      await axios.post(
  API + "/ciclicos/" + ciclicoActivo._id + "/captura",
  nuevo
);

      await cargarCapturas(ciclicoActivo._id);

      await cargarCiclicos();

      setSku("");

      setItem(null);

      setConteo("");
skuInputRef.current?.focus();

   } catch (err) {

  console.log(err);

  toast.error("SKU ya capturado");

} finally {

  setLoading(false);
}
  };

  // ================= ABRIR CICLICO =================

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

// ================= RESUMEN EJECUTIVO =================

const totalSKUs = captura.length;

const totalDiferencias = captura.filter(
  i => i.diferencia !== 0
).length;

const sobrantes = captura
  .filter(i =>
    (Number(i.diferencia || 0) *
    Number(i.costo || 0)) > 0
  )
  .reduce(
    (acc, i) =>
      acc +
      (
        Number(i.diferencia || 0) *
        Number(i.costo || 0)
      ),
    0
  );

const faltantes = captura
  .filter(i =>
    (Number(i.diferencia || 0) *
    Number(i.costo || 0)) < 0
  )
  .reduce(
    (acc, i) =>
      acc +
      (
        Number(i.diferencia || 0) *
        Number(i.costo || 0)
      ),
    0
  );

const ajusteTotal = captura
  .reduce(
    (acc, i) =>
      acc +
      (
        Number(i.diferencia || 0) *
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
        📦
      </div>

      <div>

        <h1 className="ciclico-title">
          Módulo Cíclicos
        </h1>

        <div
          style={{
            color: "#94a3b8",
            marginTop: "8px"
          }}
        >
          Control inteligente de inventario
        </div>

      </div>

    </div>

  </div>

</div>

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
{/* ================= RESUMEN ================= */}
{captura.length > 0 && (
<>
<div style={{ marginTop: "25px" }}>
<div className="kpis">

  <div className="kpi blue">
    <h3>{totalSKUs}</h3>
    <p>Total SKUs</p>
  </div>

  <div className="kpi yellow">
    <h3>{totalDiferencias}</h3>
    <p>Diferencias</p>
  </div>

  <div className="kpi green">
    <h3>
      $
      {sobrantes.toLocaleString()}
    </h3>

    <p>Sobrantes</p>
  </div>

  <div className="kpi red">
    <h3>
      $
      {Math.abs(faltantes)
        .toLocaleString()}
    </h3>

    <p>Faltantes</p>
  </div>

  <div className="kpi orange">
    <h3>
      $
      {ajusteTotal.toLocaleString()}
    </h3>

    <p>Ajuste Total</p>
  </div>

</div>
{/* ================= FILTROS ================= */}

<div
  style={{
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
    flexWrap: "wrap"
  }}
>

  <button
    className="btn-pro btn-secondary"
    onClick={() => setFiltroTabla("todos")}
  >
    Todos
  </button>

  <button
    className="btn-pro btn-secondary"
    onClick={() => setFiltroTabla("diferencias")}
  >
    Diferencias
  </button>

  <button
    className="btn-pro btn-secondary"
    onClick={() => setFiltroTabla("sobrantes")}
  >
    Sobrantes
  </button>

  <button
    className="btn-pro btn-secondary"
    onClick={() => setFiltroTabla("faltantes")}
  >
    Faltantes
  </button>

</div>
</div>

</>
)}
{/* TABLA */}
{captura.length > 0 && (
<div
  style={{
    overflowX: "auto",
    marginTop: "20px"
  }}
>

<table className="table-pro">
   
<thead
  style={{
    background: "#111"
  }}
>
              <tr>
               
<th style={{ padding: "12px" }}>SKU</th>

<th style={{ padding: "12px" }}>
  Artículo
</th>

<th style={{ padding: "12px" }}>
  Ubicación
</th>

<th style={{ padding: "12px" }}>
  Sistema
</th>

<th style={{ padding: "12px" }}>
  Conteo
</th>

<th style={{ padding: "12px" }}>
  Diferencia
</th>

<th style={{ padding: "12px" }}>
  Costo Unidad
</th>

<th style={{ padding: "12px" }}>
  Ajuste $
</th>
<th style={{ padding: "12px" }}>
  Acciones
</th>
              </tr>
            </thead>

            <tbody>

             {capturaFiltrada.map((i, idx) => {

const diferenciaCalculada =

  Number(i.conteo || 0) -

  Number(i.sistema || 0);

return (
              
<tr
  key={i._id}
  style={{

    borderBottom: "1px solid #333",

    background:

      diferenciaCalculada > 0
        ? "rgba(34,197,94,0.15)"

      : diferenciaCalculada < 0
        ? "rgba(239,68,68,0.15)"

      : "#1e1e1e"
  }}
>

<td style={{ padding: "12px" }}>
  {i.sku}
</td>

<td style={{ padding: "12px" }}>
  {i.articulo}
</td>

<td style={{ padding: "12px" }}>
  {i.ubicacion}
</td>

<td style={{ padding: "12px" }}>
  {i.sistema}
</td>

<td style={{ padding: "12px" }}>
  {i.conteo}
</td>

<td
  style={{
    padding: "12px",

    color:
      diferenciaCalculada !== 0
        ? "#ff4d4f"
        : "#52c41a",

    fontWeight: "bold"
  }}
>
  {diferenciaCalculada}
</td>

<td style={{ padding: "12px" }}>
  $
  {Number(i.costo || 0)
    .toLocaleString()}
</td>

<td
  style={{
    padding: "12px",

    color:
      diferenciaCalculada *
      Number(i.costo || 0) < 0
        ? "#ff4d4f"
        : "#52c41a",

    fontWeight: "bold"
  }}
>
  $
  {(
    diferenciaCalculada *
    Number(i.costo || 0)
  ).toLocaleString()}
</td>

<td style={{ padding: "12px" }}>

<button
  className="btn-pro btn-secondary"

  onClick={async () => {

    const nuevo = prompt(
      "Nuevo conteo:",
      i.conteo
    );

    if (
      nuevo === null ||
      nuevo === ""
    ) return;

try {

  await axios.put(
    API + "/capturas/" + i._id,
    {
      conteo: Number(nuevo)
    }
  );

  toast.success("Actualizado 🔥");

  setCaptura(prev =>

    prev.map(c => {

      if (c._id !== i._id) {
        return { ...c };
      }

      return {

        ...c,

        conteo: Number(nuevo)
      };
    })
  );

} catch (err) {

  console.log(err);

  toast.error("Error editando");
}
  }}

  style={{
    padding: "8px 12px",
    fontSize: "14px"
  }}
>
  ✏ Editar
</button>
<button
  className="btn-pro btn-danger"

  onClick={async () => {

    const confirmar = window.confirm(
      "¿Eliminar captura?"
    );

    if (!confirmar) return;

    try {

      await axios.delete(
        API + "/capturas/" + i._id
      );

      toast.success("Eliminado 🔥");

      const nuevasCapturas =
  await axios.get(
    API +
    "/ciclicos/" +
    ciclicoActivo._id +
    "/capturas"
  );

setCaptura(nuevasCapturas.data);

await cargarCiclicos();

    } catch (err) {

      console.log(err);

      toast.error("Error eliminando");
    }
  }}

  style={{
    padding: "8px 12px",
    fontSize: "14px",
    marginLeft: "8px"
  }}
>
  🗑 Eliminar
</button>

</td>

</tr>

);
})}

            </tbody>

          </table>
</div>
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
    </div>

);
}

export default Ciclicos;