const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Private school",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          required: ["username", "phone", "password", "role"],
          properties: {
            _id: {
              type: "objectId",
              description: "The auto-generated id of the user",
            },
            username: {
              type: "string",
              description: "The username of the user",
            },
            phone: {
              type: "string",
              description: "The phone of the user",
            },
            password: {
              type: "string",
              description: "The password of the user",
            },
            role: {
              type: "string",
              description: "The role of the user",
            },
          },
          example: {
            _id: "6672b9ced3d6fdaf5d15865d",
            username: "John Doe",
            phone: "901234567",
            password: "johndoe123",
            role: "admin",
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["src/routes/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
