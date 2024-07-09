const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Private school",
      version: "0.1.0",
      description:
        "This is a manageble, comprehensive and useful system for school owners",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
      },
    ],
    // explorer: true,
    // components: {
    //   securitySchemes: {
    //     bearerAuth: {
    //       type: "http",
    //       scheme: "bearer",
    //       bearerFormat: "JWT",
    //     },
    //   },
    //   // security: [
    //   //   {
    //   //     bearerAuth: [],
    //   //   },
    //   // ],
    //   schemas: {
    //     User: {
    //       type: "object",
    //       required: ["username", "phone", "password", "role"],
    //       properties: {
    //         _id: {
    //           type: "string",
    //           description: "The auto-generated id of the user",
    //           readOnly: true,
    //         },
    //         username: {
    //           type: "string",
    //           description: "The username of the user",
    //         },
    //         phone: {
    //           type: "string",
    //           description: "The phone of the user",
    //         },
    //         password: {
    //           type: "string",
    //           description: "The password of the user",
    //         },
    //         role: {
    //           type: "string",
    //           description: "The role of the user",
    //         },
    //       },
    //       example: {
    //         // _id: "6672b9ced3d6fdaf5d15865d",
    //         username: "John Doe",
    //         phone: "901234567",
    //         password: "johndoe123",
    //         role: "admin",
    //       },
    //     },
    //     Pupil: {
    //       type: "object",
    //       required: ["firstname", "lastname", "phone", "address", "password"],
    //       properties: {
    //         _id: {
    //           type: "string",
    //           description: "The auto-generated id of the pupil",
    //           readOnly: true,
    //         },
    //         firstname: {
    //           type: "string",
    //           description: "The firstname of the pupil",
    //         },
    //         lastname: {
    //           type: "string",
    //           description: "The lastname of the pupil",
    //         },
    //         phone: {
    //           type: "string",
    //           description: "The phone of the pupil",
    //         },
    //         parent: {
    //           type: "object",
    //           description: "Credentials of pupil's parent",
    //           properties: {
    //             fullname: {
    //               type: "string",
    //               description: "The fullname of the pupil's parent",
    //             },
    //             phone: {
    //               type: "string",
    //               description: "The phone of the pupil's parent",
    //             },
    //           },
    //         },
    //         img: {
    //           type: "string",
    //           format: "binary",
    //           description: "The URL of the pupil's image",
    //         },
    //         address: {
    //           type: "string",
    //           description: "The address of the pupil",
    //         },
    //         password: {
    //           type: "string",
    //           description: "The password of the pupil",
    //         },
    //         birthCertificate: {
    //           type: "string",
    //           description: "The birth certificate of the pupil",
    //         },
    //         group: {
    //           type: "string",
    //           description: "The group of the pupil",
    //         },
    //       },
    //       example: {
    //         firstname: "Patrick",
    //         lastname: "Bateman",
    //         password: "patrickbateman123",
    //         parent: {
    //           fullname: "johndoe123",
    //           phone: "991234567",
    //         },
    //         img: "string",
    //         phone: "951234567",
    //         address: "France, Paris",
    //         birthCertificate: "0192837465",
    //         group: "6672b9ced3d6fdaf5d15865b",
    //       },
    //     },
    //     Group: {
    //       type: "object",
    //       required: ["name"],
    //       properties: {
    //         _id: {
    //           type: "string",
    //           description: "The auto-generated id of the group",
    //           readOnly: true,
    //         },
    //         name: {
    //           type: "string",
    //           description: "The name of the group",
    //         },
    //       },
    //       example: {
    //         _id: "6672b9ced3d6fdaf5d15865c",
    //         name: "1-A",
    //       },
    //     },
    //     Checkout: {
    //       type: "object",
    //       required: ["pupil"],
    //       properties: {
    //         _id: {
    //           type: "objectId",
    //           description: "The auto-generated id of the checkout",
    //           readOnly: true,
    //         },
    //         pupil: {
    //           type: "objectId",
    //           description: "Pupil identifier",
    //         },
    //         checkIn: {
    //           type: "string",
    //           description: "The time when pupil came to the school",
    //         },
    //         checkOut: {
    //           type: "string",
    //           description: "The time when pupil went out from school",
    //         },
    //       },
    //       example: {
    //         _id: "6672b9ced3d6fdaf5d15865e",
    //         pupil: "6672b9ced3d6fdaf5d15865f",
    //         checkIn: "2024-06-01 07:33",
    //         checkOut: "2024-06-01 12:42",
    //       },
    //     },
    //   },
    // },
  },
  apis: ["src/public/*.yaml"],
};

const specs = swaggerJsdoc(options);

const option = {
  explorer: true,
  swaggerOptions: {
    urls: [
      {
        url: `http://localhost:${process.env.PORT}/api-docs/swagger_admin.yaml`,
        name: "admin",
      },
      {
        url: `http://localhost:${process.env.PORT}/api-docs/swagger_boss.yaml`,
        name: "boss",
      },
      {
        url: `http://localhost:${process.env.PORT}/api-docs/swagger_device.yaml`,
        name: "device",
      },
      {
        url: `http://localhost:${process.env.PORT}/api-docs/swagger_parent.yaml`,
        name: "parent",
      },
    ],
  },
};

module.exports = specs;

module.exports.setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, option));
};
