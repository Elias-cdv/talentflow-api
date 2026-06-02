const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "TalentFlow API",
    description: "Enterprise-grade Employee Management System API [cite: 10]",
  },
  host: "localhost:8080",
  schemes: ["http", "https"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./routes/index.js"];

// Genera el archivo swagger-output.json de forma automática
swaggerAutogen(outputFile, endpointsFiles, doc);
