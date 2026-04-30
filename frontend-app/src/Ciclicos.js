import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const API = "https://ticket-pro-backend.onrender.com";

function Ciclicos() {

  const [modo, setModo] = useState("inicio");

  const [sku, setSku] = useState("");
  const [item, setItem] = useState(null);

  const [captura, setCaptura] = useState([]);
  const [conteo, setConteo] = useState("");

  // 📥 SUBIR EXCEL

  const subirExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet);

    const limpio = json.map(row => ({
      sku: row["Código del artículo"] || row["Codigo"] || row["SKU"],
      articulo: row["Artículo"] || row["Descripcion"],
      existencia: row["Existencia"] || 0
    }));

    await axios.post(`${API}/inventario/upload`, {
      data: limpio
    });

    alert("Inventario cargado correctamente 🔥");
  };

  // 🔍 CONSULTA NORMAL
  const buscar = async () => {
    if (!sku) return;

    try {
      const res = await axios.get(`${API}/inventario/${sku}`);
      setItem(res.data);
    } catch {
      alert("No encontrado");
    }
  };

  // 🔍 BUSCAR PARA CICLICO (CON CATALOGO)
  const buscarParaCiclico = async () => {
    if (!sku) return;

    try {
      const res = await axios.get(`${API}/inventario/${sku}`);

      if (res.data) {
        setItem(res.data);
        return;
      }

      const buscarParaCiclico = async () => {
  if (!sku) return;

  try {
    const res = await axios.get(`${API}/inventario/${sku}`);

    if (res.data) {
      setItem(res.data);
      return;
    }

    // 🔥 mientras no haya catálogo
    alert("SKU no encontrado en inventario");

  } catch {
    alert("Error conexión");
  }
};

      if (cat.data) {
        setItem({
          sku,
          articulo: cat.data.articulo,
          existencia: 0
        });
        alert("SKU sin existencia");
        return;
      }

      alert("SKU no existe");

    } catch (err) {
      console.log(err);
      alert("Error conexión");
    }
  };

  // ➕ AGREGAR AL CICLICO
  const agregar = () => {
    if (!item || conteo === "") return;

    // 🔒 evitar duplicados
    if (captura.find(i => i.sku === item.sku)) {
      alert("SKU ya capturado");
      return;
    }

    const nuevo = {
      sku: item.sku,
      articulo: item.articulo,
      sistema: item.existencia,
      conteo: Number(conteo)
    };

    setCaptura([...captura, nuevo]);

    // limpiar
    setSku("");
    setItem(null);
    setConteo("");
  };

  return (
    <div className="card">

      <h2>📦 Módulo Cíclicos</h2>

      {/* 📥 SUBIR EXCEL */}
      <div style={{ marginBottom: "20px" }}>
        <label>📥 Subir Inventario Excel</label><br />
        <input type="file" onChange={subirExcel} />
      </div>
<div style={{ marginBottom: "20px" }}>
  <label>📋 Subir Catálogo (solo códigos)</label><br />
  <input type="file" onChange={subirCatalogo} />
</div>

      {/* ================= INICIO ================= */}
      {modo === "inicio" && (
        <>
          {/* 🔍 BUSCADOR */}
          <div style={{ marginBottom: "20px" }}>
            <input
              placeholder="Buscar SKU"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
            <button onClick={buscar}>Buscar</button>

            {item && (
              <div>
                <p><b>Artículo:</b> {item.articulo}</p>
                <p><b>Existencia:</b> {item.existencia}</p>
              </div>
            )}
          </div>

          <button onClick={() => setModo("captura")}>
            Nuevo Cíclico
          </button>
        </>
      )}

      {/* ================= CAPTURA ================= */}
      {modo === "captura" && (
        <>
          <h3>📝 Captura de Cíclico</h3>

          <input
            placeholder="Escanea o escribe SKU"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />
          <button onClick={buscarParaCiclico}>Buscar</button>

          {item && (
            <div>
              <p>{item.articulo}</p>
              <p>Sistema: {item.existencia}</p>

              <input
                placeholder="Conteo"
                value={conteo}
                onChange={(e) => setConteo(e.target.value)}
              />

              <button onClick={agregar}>Agregar</button>
            </div>
          )}

          {/* TABLA */}
          <table style={{ width: "100%", marginTop: "20px" }}>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Sistema</th>
                <th>Conteo</th>
                <th>Diferencia</th>
              </tr>
            </thead>

            <tbody>
              {captura.map((i, idx) => (
                <tr key={idx}>
                  <td>{i.sku}</td>
                  <td>{i.sistema}</td>
                  <td>{i.conteo}</td>
                  <td style={{ color: i.conteo - i.sistema !== 0 ? "red" : "green" }}>
                    {i.conteo - i.sistema}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <br />

          <button onClick={() => setModo("inicio")}>
            Terminar
          </button>
        </>
      )}

    </div>
  );
}

export default Ciclicos;