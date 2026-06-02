const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongodb = require("./config/db");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware de seguridad y lectura de datos
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Redirigir todo el tráfico al enrutador principal
app.use("/", require("./routes"));

// Inicializar la base de datos y mantener el servidor ESCUCHANDO (Evita el clean exit)
mongodb.initDb((err) => {
  if (err) {
    console.error("❌ Error al conectar a MongoDB Atlas:", err);
  } else {
    app.listen(port, () => {
      console.log(`====================================================`);
      console.log(`🚀 Servidor activo en: http://localhost:${port}`);
      console.log(`📑 Panel de Swagger: http://localhost:${port}/api-docs`);
      console.log(`====================================================`);
    });
  }
});
