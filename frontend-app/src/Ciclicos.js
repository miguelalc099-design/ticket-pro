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
  .filter(i => i.ajuste > 0)
  .reduce((acc, i) => acc + Number(i.ajuste || 0), 0);

const faltantes = captura
  .filter(i => i.ajuste < 0)
  .reduce((acc, i) => acc + Number(i.ajuste || 0), 0);

const ajusteTotal = captura
  .reduce((acc, i) =>
    acc + Number(i.ajuste || 0), 0);
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
<>
<Toaster
  position="top-right"
/>

<div className="card">

      <h2>📦 Módulo Cíclicos</h2>
<div
style={{
  background:
    "linear-gradient(145deg, #111827, #020617)",

  border: "1px solid #1e293b",

  borderRadius: "18px",

  padding: "22px",

  marginBottom: "25px",

  boxShadow:
    "0 15px 35px rgba(0,0,0,0.45)"
}}
>

  <h3>🔧 Herramientas</h3>

{/* INVENTARIO */}

<div style={{ marginBottom: "15px" }}>

<label
  style={{
    fontSize: "15px",
    fontWeight: "600",
    color: "#fff"
  }}
>
  📥 Actualizar Inventario
</label>

  <br />

  <input
  type="file"

  style={{
    marginTop: "10px",
    color: "#94a3b8"
  }}

  onChange={subirExcel}
/>

</div>

  {/* CATALOGO */}

  <div style={{ marginBottom: "15px" }}>

<label
  style={{
    fontSize: "15px",
    fontWeight: "600",
    color: "#fff"
  }}
>
  📋 Actualizar Catálogo
</label>

    <br />

  <input
  type="file"

  style={{
    marginTop: "10px",
    color: "#94a3b8"
  }}

  onChange={subirCatalogo}
/>

  </div>

</div>

      {/* ================= LISTA ================= */}

      {modo === "lista" && (
        <>
<div style={{ marginBottom: "20px" }}>

  <input
    type="text"
    placeholder="🔍 Buscar SKU o descripción..."
    value={busqueda}
    onChange={(e) =>
      buscarDescripcion(e.target.value)
    }
 
style={{
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #444",
  fontSize: "16px",
  background: "#1e1e1e",
  color: "#fff"
}}

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
      
style={{
  border: "1px solid #444",
  borderRadius: "10px",
  padding: "12px",
  background: "#1e1e1e",
  color: "#fff",
  boxShadow: "0 2px 5px rgba(0,0,0,0.3)"
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
              style={{
                border: "1px solid #333",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "10px"
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
  placeholder="📝 Título del cíclico"
  value={titulo}

  onChange={(e) =>
    setTitulo(e.target.value)
  }

  style={{
    width: "100%",
    padding: "16px",
    borderRadius: "14px",
    border: "2px solid #334155",
    background: "#0f172a",
    color: "#fff",
    fontSize: "18px",
    outline: "none",
    boxSizing: "border-box"
  }}
/>

          <br /><br />

          <input
  type="date"
  value={fecha}

  onChange={(e) =>
    setFecha(e.target.value)
  }

  style={{
    width: "100%",
    padding: "16px",
    borderRadius: "14px",
    border: "2px solid #334155",
    background: "#0f172a",
    color: "#fff",
    fontSize: "18px",
    outline: "none",
    boxSizing: "border-box"
  }}
/>

          <br /><br />

          <button
  className="btn-pro"
  onClick={crearCiclico}
>
            🚀 Iniciar Cíclico
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

          {ciclicoActivo.estado === "Abierto" && (
            <>

              <input
ref={skuInputRef}
  placeholder="🔍 Escanea o escribe SKU"
  value={sku}
  onChange={(e) => setSku(e.target.value)}

  onKeyDown={(e) => {

    if (e.key === "Enter") {

      buscarParaCiclico();
    }
  }}

  style={{
    width: "100%",
    padding: "16px",
    borderRadius: "14px",
    border: "2px solid #334155",
    background: "#0f172a",
    color: "#fff",
    fontSize: "20px",
    outline: "none",
    boxSizing: "border-box"
  }}
/>
<br /><br />

<input
  type="text"
  placeholder="🔍 Buscar descripción..."
  value={busqueda}
  onChange={(e) =>
    buscarDescripcion(e.target.value)
  }
  style={{
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #444",
    fontSize: "16px",
    background: "#1e1e1e",
    color: "#fff"
  }}
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

      style={{
        border: "1px solid #444",
        borderRadius: "10px",
        padding: "12px",
        background: "#1e1e1e",
        color: "#fff",
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

                  <input
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

  style={{
    width: "100%",
    padding: "16px",
    borderRadius: "14px",
    border: "2px solid #334155",
    background: "#0f172a",
    color: "#fff",
    fontSize: "22px",
    marginBottom: "12px",
    boxSizing: "border-box"
  }}
/>

                  <button
  className="btn-pro"
  onClick={agregar}
>
                    Agregar
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

  <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
      minWidth: "1200px",
      background: "#1e1e1e",
      color: "#fff",
      borderRadius: "10px",
      overflow: "hidden"
    }}
  >
   
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
              </tr>
            </thead>

            <tbody>

             {capturaFiltrada.map((i, idx) => (

              
<tr
  key={idx}
  style={{

    borderBottom: "1px solid #333",

    background:

      i.diferencia > 0
        ? "rgba(34,197,94,0.15)"

      : i.diferencia < 0
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
      i.diferencia !== 0
        ? "#ff4d4f"
        : "#52c41a",
    fontWeight: "bold"
  }}
>
  {i.diferencia}
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
      i.ajuste < 0
        ? "#ff4d4f"
        : "#52c41a",
    fontWeight: "bold"
  }}
>
  $

  {Number(i.ajuste || 0)
    .toLocaleString()}
</td>

                </tr>
              ))}

            </tbody>

          </table>
</div>
)}

          <br />

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
  style={{ marginLeft: "10px" }}
            onClick={() => {
              setModo("lista");
              setItem(null);
            }}
          >
            ← Volver
          </button>

        </>
      )}

        </div>
    </>
  );
}

export default Ciclicos;