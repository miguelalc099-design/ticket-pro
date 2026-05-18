const Pagination = ({
  paginaActual,
  totalPaginas,
  setPaginaActual,
}) => {

  if (totalPaginas <= 1) return null

  const cambiarPagina = (pagina) => {
    if (pagina < 1 || pagina > totalPaginas) return
    setPaginaActual(pagina)
  }

  return (
    <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap mt-4">

      <button
        className="btn btn-sm btn-outline-light"
        onClick={() => cambiarPagina(paginaActual - 1)}
        disabled={paginaActual === 1}
      >
        ←
      </button>

      {Array.from({ length: totalPaginas }, (_, index) => {
        const pagina = index + 1

        return (
          <button
            key={pagina}
            className={`btn btn-sm ${
              paginaActual === pagina
                ? "btn-primary"
                : "btn-outline-light"
            }`}
            onClick={() => cambiarPagina(pagina)}
          >
            {pagina}
          </button>
        )
      })}

      <button
        className="btn btn-sm btn-outline-light"
        onClick={() => cambiarPagina(paginaActual + 1)}
        disabled={paginaActual === totalPaginas}
      >
        →
      </button>

    </div>
  )
}

export default Pagination