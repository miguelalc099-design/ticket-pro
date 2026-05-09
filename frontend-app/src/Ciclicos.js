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

  const file = e.target.files[0];

  if (!file) return;

  const data = await file.arrayBuffer();

  const workbook = XLSX.read(data);

  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const json = XLSX.utils.sheet_to_json(sheet);

const limpio = json;

console.log(limpio.slice(0, 5));

await axios.post(API + "/inventario/upload", {
  data: limpio
});
  alert("Inventario cargado 🔥");
};
  // ================= SUBIR CATALOGO =================
const subirCatalogo = async (e) => {

  const file = e.target.files[0];

  if (!file) return;

  const data = await file.arrayBuffer();

  const workbook = XLSX.read(data);

  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const json = XLSX.utils.sheet_to_json(sheet);

const limpio = json;

await axios.post(API + "/catalogo/upload", {
  data: limpio
});

  alert("Catálogo cargado 🔥");
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

    // 🔥 NO EXISTE EN NINGUNO
    if (!inv.data && !cat.data) {
      alert("SKU no existe");
      return;
    }

    setItem({

      sku: codigo,

      articulo:
        inv.data?.articulo ||
        cat.data?.articulo ||
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

      {/* ================= LISTA ================= */}

      {modo === "lista" && (
        <>

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

          {/* INVENTARIO */}

          <div style={{ marginBottom: "20px" }}>
            <label>📥 Subir Inventario</label>
            <br />

            <input
              type="file"
              onChange={subirExcel}
            />
          </div>

          {/* CATALOGO */}

          <div style={{ marginBottom: "20px" }}>
            <label>📋 Subir Catálogo</label>
            <br />

            <input
              type="file"
              onChange={subirCatalogo}
            />
          </div>

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

              <button onClick={buscarParaCiclico}>
                Buscar
              </button>

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