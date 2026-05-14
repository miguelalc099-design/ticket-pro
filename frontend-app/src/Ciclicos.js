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
import {
  obtenerCiclicos,
  obtenerCapturas,
  crearCiclicoService,
  cerrarCiclicoService,
  agregarCapturaService,
  actualizarCapturaService,
  eliminarCapturaService
} from "./services/ciclicosService";
import {
  calcularResumen
} from "./utils/calcularResumen";
import {
  exportarExcelCiclico
} from "./utils/exportExcel";
import useCiclicos from "./hooks/useCiclicos";
import ListaCiclicos from "./components/ciclicos/views/ListaCiclicos";
import CapturaCiclico from "./components/ciclicos/views/CapturaCiclico";
const API = "https://ticket-pro-backend.onrender.com";


function Ciclicos({ user }) {

  // ================= ESTADOS =================
  const [sku, setSku] = useState("");
  const [item, setItem] = useState(null);
  const [conteo, setConteo] = useState("");
  const [titulo, setTitulo] = useState("");
  const [fecha, setFecha] = useState("");
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

const {

  modo,
  setModo,

  captura,
  setCaptura,

  ciclicos,

  ciclicoActivo,
  setCiclicoActivo,

  cargarCiclicos,
  cargarCapturas,

  abrirCiclico,
  cerrarCiclico

} = useCiclicos();
  // ================= CREAR CICLICO =================

  const crearCiclico = async () => {

  setLoading(true);

    if (!titulo || !fecha) {
      toast.error("Completa título y fecha");
setLoading(false);
      return;
    }

    try {

      const data =
  await crearCiclicoService({
    titulo,
    fecha,
    creadoPor: user.username
  });

setCiclicoActivo(data);

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

   await agregarCapturaService(
  ciclicoActivo._id,
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

   await actualizarCapturaService(
  existente._id,
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
  // ================= FILTROS TABLA =================
const {
  totalSKUs,
  totalDiferencias,
  sobrantes,
  faltantes,
  ajusteTotal
} = calcularResumen(captura);
const guardarEdicion = async () => {

  try {

    await actualizarCapturaService(
      editarItem._id,
      {
        conteo: Number(
          nuevoConteoEdit || 0
        )
      }
    );

    toast.success(
      "Actualizado 🔥"
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
  }
};
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
  Control de inventario ciclicos para Ticho y Adriel
</p>

      </div>

    </div>

  </div>

</div>
<div style={{ marginBottom: "45px" }} />

{modo === "lista" && (

<ListaCiclicos

  busqueda={busqueda}
  buscarDescripcion={buscarDescripcion}
  resultados={resultados}

  subirExcel={subirExcel}
  subirCatalogo={subirCatalogo}

  setModo={setModo}

  ciclicos={ciclicos}
  abrirCiclico={abrirCiclico}

  exportarExcelCiclico={
    exportarExcelCiclico
  }

  toast={toast}

/>

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

<CapturaCiclico

  ciclicoActivo={ciclicoActivo}

  sku={sku}
  setSku={setSku}

  busqueda={busqueda}
  buscarDescripcion={buscarDescripcion}

  resultados={resultados}
  setResultados={setResultados}
  setBusqueda={setBusqueda}

  buscarParaCiclico={
    buscarParaCiclico
  }

  item={item}
  setItem={setItem}

  conteo={conteo}
  setConteo={setConteo}

  agregar={agregar}

  loading={loading}

  conteoInputRef={conteoInputRef}
  skuInputRef={skuInputRef}

  captura={captura}

  totalSKUs={totalSKUs}
  totalDiferencias={
    totalDiferencias
  }

  sobrantes={sobrantes}

  faltantes={faltantes}

  ajusteTotal={ajusteTotal}

  setFiltroTabla={
    setFiltroTabla
  }

  capturaFiltrada={
    capturaFiltrada
  }

  setEditarItem={
    setEditarItem
  }

  setNuevoConteoEdit={
    setNuevoConteoEdit
  }

  setEditarModal={
    setEditarModal
  }

  toast={toast}
  axios={axios}
  API={API}

  setCaptura={setCaptura}
  cargarCiclicos={cargarCiclicos}

  cerrarCiclico={cerrarCiclico}
  setModo={setModo}

  setDuplicadoModal={
    setDuplicadoModal
  }

  setDuplicadoData={
    setDuplicadoData
  }

/>

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