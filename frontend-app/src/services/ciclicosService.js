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