import * as XLSX from "xlsx";

/* =========================
   EXPORTAR EXCEL
========================= */

export const exportarExcelLavados = (

  lavados,

  fechaInicio,

  fechaFin

) => {

  /* =========================
     FILTRAR FECHAS
  ========================= */

  const filtrados =
    lavados.filter((l) => {

    const fecha =
      new Date(
        l.fechaLavado
      );

    return (

      fecha >=
      new Date(fechaInicio)

      &&

      fecha <=
      new Date(fechaFin)

    );

  });

  /* =========================
     DATA
  ========================= */

  const data =
    filtrados.map((l) => ({

    Folio:
      l.folio,

    Fecha:
      new Date(
        l.fechaLavado
      ).toLocaleDateString(),

    Unidad:
      l.numeroUnidad,

    TipoUnidad:
      l.tipoUnidad,

    Operadores:
      l.operadores?.join(", "),

    CantidadOperadores:
      l.cantidadOperadores,

    TiposLavado:
      l.tiposLavado?.join(", "),

    Estatus:
      l.estatus,

    Supervisor:
      l.aprobadoPor || "",

    ComentarioSupervisor:
      l.comentarioSupervisor || ""

  }));

  /* =========================
     SHEET
  ========================= */

  const worksheet =
    XLSX.utils.json_to_sheet(
      data
    );

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(

    workbook,

    worksheet,

    "Lavados"

  );

  /* =========================
     SAVE
  ========================= */

  XLSX.writeFile(

    workbook,

`Lavados_${fechaInicio}_${fechaFin}.xlsx`

  );

};