const jwt =
  require("jsonwebtoken");

const auth =
  (req, res, next) => {

  try {

    /* =========================
       TOKEN
    ========================= */

    const authHeader =
      req.headers.authorization;

    if (!authHeader) {

      return res
        .status(401)
        .json({

          msg:
            "Token requerido"

        });
    }

    /* =========================
       BEARER
    ========================= */

    const token =
      authHeader.split(" ")[1];

    if (!token) {

      return res
        .status(401)
        .json({

          msg:
            "Token inválido"

        });
    }

    /* =========================
       VERIFY
    ========================= */

    const decoded =
      jwt.verify(

        token,

        process.env.JWT_SECRET
      );

    /* =========================
       USER
    ========================= */

    req.user = decoded;

    next();

  } catch (err) {

    console.log(err);

    return res
      .status(401)
      .json({

        msg:
          "No autorizado"

      });
  }

};

module.exports =
  auth;