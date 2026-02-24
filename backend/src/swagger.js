const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Toko Pakaian API",
      version: "1.0.0",
      description:
        "Dokumentasi API untuk aplikasi toko pakaian (Admin & Kasir)",
      contact: {
        name: "Toko Pakaian Support",
        email: "support@tokopakaian.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT token dari endpoint /auth/login",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  // 🔥 SCAN FILE ROUTE UNTUK DOKUMENTASI SWAGGER
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJSDoc(options);

module.exports = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};

