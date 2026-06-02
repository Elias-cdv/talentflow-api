const router = require("express").Router();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger-output.json");

// Servir la documentación de Swagger de forma obligatoria en /api-docs
router.use("/api-docs", swaggerUi.serve);
router.get("/api-docs", swaggerUi.setup(swaggerDocument));

// Enlaces a los sub-enrutadores de las colecciones de la Week 05
router.use("/departments", require("./departments"));
router.use("/employees", require("./employees"));

module.exports = router;
