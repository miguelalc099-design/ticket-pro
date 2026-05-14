import axios from "axios";

const API =
  "https://ticket-pro-backend.onrender.com";

// ================= CICLICOS =================

export const obtenerCiclicos =
  async () => {

    const res = await axios.get(
      API + "/ciclicos"
    );

    return res.data;
};

// ================= CAPTURAS =================

export const obtenerCapturas =
  async (id) => {

    const res = await axios.get(
      API +
      "/ciclicos/" +
      id +
      "/capturas"
    );

    return res.data;
};
export const crearCiclicoService =
  async (payload) => {

    const res = await axios.post(
      API + "/ciclicos",
      payload
    );

    return res.data;
};

export const cerrarCiclicoService =
  async (id) => {

    const res = await axios.put(
      API +
      "/ciclicos/" +
      id +
      "/cerrar"
    );

    return res.data;
};

export const agregarCapturaService =
  async (id, payload) => {

    const res = await axios.post(
      API +
      "/ciclicos/" +
      id +
      "/captura",
      payload
    );

    return res.data;
};

export const actualizarCapturaService =
  async (id, payload) => {

    const res = await axios.put(
      API + "/capturas/" + id,
      payload
    );

    return res.data;
};

export const eliminarCapturaService =
  async (id) => {

    const res = await axios.delete(
      API + "/capturas/" + id
    );

    return res.data;
};