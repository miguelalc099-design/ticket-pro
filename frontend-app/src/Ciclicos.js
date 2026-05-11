import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

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
      alert("Completa título y fecha");
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
      alert("Error creando cíclico");
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

    alert("Inventario cargado 🔥");

  } catch (err) {

    console.log(err);

    alert("Error subiendo inventario");
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

    alert("Catálogo cargado 🔥");

  } catch (err) {

    console.log(err);

    alert("Error subiendo catálogo");
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

      alert("SKU no existe");

      return;
    }

    setItem({

      sku: codigo,

      articulo:
        inv.data?.articulo ||
        "Sin descripción",

      existencia:
        inv.data?.existencia || 0,

      ubicacion:
        cat.data?.ubicacion || "N/A"

    });

  } catch (err) {

    console.log(err);

    alert("Error conexión");
  }
};  


// ================= BUSQUEDA INTELIGENTE =================

const buscarDescripcion = async (texto) => {

  setBusqueda(texto);

  // 🔥 MUY CORTO
  if (texto.trim().length < 2) {

    setResultados([]);

    return;
  }

  try {

    const res = await axios.get(
      API + "/buscar?q=" + texto
    );

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

        ubicacion: item.ubicacion || "-"
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

    } catch (err) {

      console.log(err);

      alert("SKU ya capturado");
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

    alert("Cíclico cerrado ✅");

    await cargarCiclicos();

    setModo("lista");

    setCaptura([]);

    setCiclicoActivo(null);

  } catch (err) {
    console.log(err);
  }
};

  // ================= RENDER =================

  return (
    <div className="card">

      <h2>📦 Módulo Cíclicos</h2>
<div
  style={{
    border: "1px solid #444",
    borderRadius: "10px",
    padding: "15px",
    marginBottom: "20px",
    background: "#1e1e1e"
  }}
>

  <h3>🔧 Herramientas</h3>

  {/* INVENTARIO */}

  <div style={{ marginBottom: "15px" }}>

    <label>📥 Actualizar Inventario</label>

    <br />

    <input
      type="file"
      onChange={subirExcel}
    />

  </div>

  {/* CATALOGO */}

  <div style={{ marginBottom: "15px" }}>

    <label>📋 Actualizar Catálogo</label>

    <br />

    <input
      type="file"
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

<div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px"
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
          <button onClick={() => setModo("nuevo")}>
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

              <p><b>Estado:</b> {c.estado}</p>

              <p>
                <b>SKUs:</b> {c.totalCapturados}
              </p>

              <p>
                <b>Diferencias:</b> {c.diferencias}
              </p>

              <button onClick={() => abrirCiclico(c)}>
                {c.estado === "Abierto"
                  ? "▶ Continuar"
                  : "👁 Ver"}
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
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <br /><br />

          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />

          <br /><br />

          <button onClick={crearCiclico}>
            🚀 Iniciar Cíclico
          </button>

          <button
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
                placeholder="Escanea SKU"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
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
<div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "15px",
    marginBottom: "20px"
  }}
>

  {resultados.map((r, index) => (

    <div
      key={index}

      onClick={() => {

        setSku(r.sku);

        setItem({

          sku: r.sku,

          articulo: r.articulo,

          existencia: r.existencia,

          ubicacion: r.ubicacion
        });

        setResultados([]);

        setBusqueda("");
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

                  <input
                    placeholder="Conteo"
                    value={conteo}
                    onChange={(e) => setConteo(e.target.value)}
                  />

                  <button onClick={agregar}>
                    Agregar
                  </button>

                </div>
              )}

            </>
          )}

          {/* TABLA */}

          <table
            style={{
              marginTop: "20px",
              width: "100%"
            }}
          >

            <thead>
              <tr>
                <th>SKU</th>
                <th>Ubicación</th>
                <th>Sistema</th>
                <th>Conteo</th>
                <th>Diferencia</th>
              </tr>
            </thead>

            <tbody>

              {captura.map((i, idx) => (

                <tr key={idx}>

                  <td>{i.sku}</td>

                  <td>{i.ubicacion}</td>

                  <td>{i.sistema}</td>

                  <td>{i.conteo}</td>

                  <td
                    style={{
                      color:
                        i.diferencia !== 0
                          ? "red"
                          : "green"
                    }}
                  >
                    {i.diferencia}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

          <br />

          {ciclicoActivo.estado === "Abierto" && (
            <button onClick={cerrarCiclico}>
              ✅ Finalizar Cíclico
            </button>
          )}

          <button
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
  );
}

export default Ciclicos;