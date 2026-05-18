import {
  useState
} from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import toast, { Toaster } from "react-hot-toast";
import ModalDuplicado from "./components/ciclicos/ModalDuplicado";
import ModalEditar from "./components/ciclicos/ModalEditar";
import {
  crearCiclicoService
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
import useCapturaCiclico from "./hooks/useCapturaCiclico";
import NuevoCiclico from "./components/ciclicos/views/NuevoCiclico";
const API = "https://ticket-pro-backend.onrender.com";


function Ciclicos({ user }) {

  // ================= ESTADOS =================
const [filtroTabla, setFiltroTabla] =
  useState("todos");
  const [fecha, setFecha] = useState("");
const [titulo, setTitulo] = useState("");  
const [tipo, setTipo] =
  useState("ciclico");

const [area, setArea] =
  useState("almacen");
  
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



    if (!titulo || !fecha) {
      toast.error("Completa título y fecha");

      return;
    }

    try {

      const data =
await crearCiclicoService({

  titulo,

  tipo,

  area,

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

const {

  sku,
  setSku,

  item,
  setItem,

  conteo,
  setConteo,

  busqueda,
  setBusqueda,

  resultados,
  setResultados,

  loading,

  duplicadoModal,
  setDuplicadoModal,

  duplicadoData,
  setDuplicadoData,

  editarModal,
  setEditarModal,

  editarItem,
  setEditarItem,

  nuevoConteoEdit,
  setNuevoConteoEdit,

  buscarParaCiclico,
  buscarDescripcion,

  agregar,

  manejarDuplicado,

  guardarEdicion,

  conteoInputRef,
  skuInputRef

} = useCapturaCiclico({

  ciclicoActivo,

  cargarCapturas,
  cargarCiclicos
});
  // ================= FILTROS TABLA =================
const {
  totalSKUs,
  totalDiferencias,
  sobrantes,
  faltantes,
  ajusteTotal
} = calcularResumen(captura);
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

<NuevoCiclico
tipo={tipo}
setTipo={setTipo}

area={area}
setArea={setArea}
  titulo={titulo}
  setTitulo={setTitulo}

  fecha={fecha}
  setFecha={setFecha}

  crearCiclico={crearCiclico}

  loading={loading}

  setModo={setModo}

/>

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