function NuevoCiclico({

  titulo,
  setTitulo,
tipo,
setTipo,

area,
setArea,

  fecha,
  setFecha,

  crearCiclico,

  loading,

  setModo

}) {

  return (
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

<select
  className="input-pro"
  value={tipo}

  onChange={(e) =>
    setTipo(e.target.value)
  }
>

<option value="ciclico">
  Cíclico
</option>

<option value="inventario">
  Inventario
</option>

</select>

<br /><br />

<select
  className="input-pro"
  value={area}

  onChange={(e) =>
    setArea(e.target.value)
  }
>

<option value="almacen">
  Almacén
</option>

<option value="llantas">
  Llantas
</option>

</select>
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

  onClick={() =>
    setModo("lista")
  }
>
  Cancelar
</button>

</>
  );
}

export default NuevoCiclico;