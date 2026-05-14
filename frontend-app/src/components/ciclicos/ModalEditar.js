function ModalEditar({
  editarModal,
  editarItem,
  nuevoConteoEdit,
  setNuevoConteoEdit,
  guardarEdicion,
  loading,
  setEditarModal,
  setEditarItem,
  skuInputRef
}) {

  if (!editarModal) return null;

  return (

<div
  style={{

    position: "fixed",

    top: 0,
    left: 0,

    width: "100%",
    height: "100%",

    background:
      "rgba(0,0,0,0.65)",

    backdropFilter: "blur(8px)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    zIndex: 9999
  }}
>

  <div
    style={{

      width: "460px",

      animation:
        "modalPop 0.25s ease",

      background:
        "linear-gradient(145deg,#0f172a,#1e293b)",

      border:
        "1px solid rgba(148,163,184,0.15)",

      borderRadius: "24px",

      padding: "30px",

      boxShadow:
        "0 20px 60px rgba(0,0,0,0.45)"
    }}
  >

    <div
      style={{
        fontSize: "55px",
        textAlign: "center",
        marginBottom: "15px"
      }}
    >
      ✏
    </div>

    <h2
      style={{
        color: "#fff",
        textAlign: "center",
        marginBottom: "10px"
      }}
    >
      Editar Conteo
    </h2>

    <p
      style={{
        color: "#94a3b8",
        textAlign: "center",
        marginBottom: "25px"
      }}
    >
      Modifica el conteo capturado
    </p>

    <div
      style={{
        background:
          "rgba(255,255,255,0.04)",

        borderRadius: "16px",

        padding: "18px",

        marginBottom: "25px"
      }}
    >

      <p style={{ color: "#fff" }}>
        <b>SKU:</b>{" "}
        {editarItem?.sku}
      </p>

      <p style={{ color: "#fff" }}>
        <b>Artículo:</b>{" "}
        {editarItem?.articulo}
      </p>

      <p style={{ color: "#fff" }}>
        <b>Conteo actual:</b>{" "}
        {editarItem?.conteo}
      </p>

    </div>

    <input
      autoFocus
      className="input-pro"
      type="number"
      placeholder="Nuevo conteo"
      value={nuevoConteoEdit}

      onChange={(e) =>
        setNuevoConteoEdit(
          e.target.value
        )
      }

      onKeyDown={(e) => {

        if (e.key === "Enter") {
          guardarEdicion();
        }
      }}
    />

    <div
      style={{
        display: "flex",
        gap: "12px",
        marginTop: "25px"
      }}
    >

      <button
        className="btn-pro"
        onClick={guardarEdicion}
        disabled={loading}
      >
        {loading
          ? "⏳ Guardando..."
          : "💾 Guardar"}
      </button>

      <button
        className="btn-pro btn-danger"

        onClick={() => {

          setEditarModal(false);

          setEditarItem(null);

          setNuevoConteoEdit("");

          skuInputRef.current?.focus();
        }}
      >
        ❌ Cancelar
      </button>

    </div>

  </div>

</div>

  );
}

export default ModalEditar;