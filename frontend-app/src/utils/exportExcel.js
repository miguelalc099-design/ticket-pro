import axios from "axios";
import * as XLSX from "xlsx";

const API =
  "https://ticket-pro-backend.onrender.com";

export const exportarExcelCiclico =
  async (c) => {

    const res = await axios.get(
      API +
      "/ciclicos/" +
      c._id +
      "/excel"
    );

    const datos = [

      [],

      ["FOLIO", c.folio],

      ["TÍTULO", c.titulo],

      ["FECHA", c.fecha],

      ["CREADO POR", c.creadoPor],

      ["ESTADO", c.estado],

      [],

      ["RESUMEN"],

      [
        "Total SKUs",
        c.totalCapturados
      ],

      [
        "Diferencias",
        c.diferencias
      ],

      [
        "Ajuste Total $",

        res.data.reduce(
          (acc, i) =>
            acc +
            Number(i.ajuste || 0),
          0
        ).toFixed(2)
      ],

      [],

      [
        "SKU",
        "Artículo",
        "Ubicación",
        "Sistema",
        "Conteo",
        "Diferencia",
        "Costo",
        "Ajuste"
      ],

      ...res.data.map(i => ([

        i.sku,

        i.articulo,

        i.ubicacion,

        i.sistema,

        i.conteo,

        i.diferencia,

        Number(i.costo || 0)
          .toFixed(2),

        Number(i.ajuste || 0)
          .toFixed(2)

      ]))
    ];

    const ws =
      XLSX.utils.aoa_to_sheet(
        datos
      );

    ws["!cols"] = [

      { wch: 18 },

      { wch: 45 },

      { wch: 20 },

      { wch: 12 },

      { wch: 12 },

      { wch: 14 },

      { wch: 14 },

      { wch: 16 }
    ];

    ws["!autofilter"] = {
      ref: "A12:H12"
    };

    const wb =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,
      ws,
      "Ciclico"
    );

    XLSX.writeFile(
      wb,
      `${c.folio}.xlsx`
    );
};