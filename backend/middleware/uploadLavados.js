const multer =
  require("multer");

const {

  CloudinaryStorage

} = require(
  "multer-storage-cloudinary"
);

const cloudinary =
  require(
    "../config/cloudinary"
  );

/* =========================
   STORAGE
========================= */

const storage =
  new CloudinaryStorage({

  cloudinary,

  params: async (
    req,
    file
  ) => ({

    folder:
      "ticket-pro/lavados",

    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "webp"
    ],

    transformation: [

      {
        width: 1600,
        crop: "limit",
        quality: "auto"
      }

    ]

  })

});

/* =========================
   MULTER
========================= */

const upload =
  multer({

  storage,

  limits: {

    fileSize:
      10 * 1024 * 1024
  }

});

/* =========================
   EXPORT
========================= */

module.exports =
  upload;