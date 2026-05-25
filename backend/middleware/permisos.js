const validarPermiso =
  (permiso) => {

  return (
    req,
    res,
    next
  ) => {

    /* =========================
       ADMIN
    ========================= */

    if (
      req.user.role ===
      "admin"
    ) {

      return next();
    }

    /* =========================
       PERMISOS
    ========================= */

    if (
      !req.user.permisos?.[
        permiso
      ]
    ) {

      return res
        .status(403)
        .json({

          msg:
            "Sin permisos"

        });
    }

    next();

  };

};

module.exports =
  validarPermiso;