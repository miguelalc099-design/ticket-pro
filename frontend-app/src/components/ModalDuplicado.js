function ModalDuplicado({
  duplicadoModal,
  duplicadoData,
  manejarDuplicado,
  setDuplicadoModal,
  setDuplicadoData,
  setSku,
  setItem,
  setConteo,
  skuInputRef
}) {

  if (!duplicadoModal) return null;

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

      width: "420px",

animation: "modalPop 0.25s ease",

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
        marginBottom: "15px",
        textAlign: "center"
      }}
    >
      ⚠
    </div>

    <h2
      style={{
        color: "#fff",
        textAlign: "center",
        marginBottom: "10px"
      }}
    >
      SKU Duplicado
    </h2>

    <p
      style={{
        color: "#94a3b8",
        textAlign: "center",
        marginBottom: "25px"
      }}
    >
      El SKU ya fue capturado.
    </p>

    <div
      style={{
        background: "rgba(255,255,255,0.04)",

        borderRadius: "16px",

        padding: "18px",

        marginBottom: "25px"
      }}
    >

      <p style={{ color: "#fff" }}>
        <b>Conteo actual:</b>{" "}
        {duplicadoData?.existente?.conteo}
      </p>

      <p style={{ color: "#fff" }}>
        <b>Nuevo conteo:</b>{" "}
        {duplicadoData?.conteoNuevo}
      </p>

    </div>

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      }}
    >

      <button
        className="btn-pro"
        onClick={() =>
          manejarDuplicado("sumar")
        }
      >
        ➕ SUMAR
      </button>

      <button
        className="btn-pro btn-secondary"
        onClick={() =>
          manejarDuplicado(
            "reemplazar"
          )
        }
      >
        🔄 REEMPLAZAR
      </button>

      <button
        className="btn-pro btn-danger"
        onClick={() => {

  setDuplicadoModal(false);

  setDuplicadoData(null);

  setSku("");

  setItem(null);

  setConteo("");

  skuInputRef.current?.focus();
}}
      >
        ❌ CANCELAR
      </button>

    </div>

  </div>

</div>

  );
}

export default ModalDuplicado;