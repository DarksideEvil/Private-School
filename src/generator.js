// const PupilModel = require("./models/pupil");
// const GroupModel = require("./models/group");
// const CheckoutModel = require("./models/checkOut");
// const { faker } = require("@faker-js/faker");
// const { default: mongoose } = require("mongoose");
// const moment = require("moment");
// // const checkInDate = moment(new Date("2024-04-01 07:05")).format(
// //   "YYYY-MM-DD HH:mm"
// // );
// // const checkOutDate = moment(new Date("2024-04-01 12:30")).format(
// //   "YYYY-MM-DD HH:mm"
// // );

// // 10-d 4-pupil

// const mongoURI = "mongodb://127.0.0.1:27017/DEMO";

// async function connectDB() {
//   try {
//     await mongoose.connect(mongoURI);
//     console.log("MongoDB connected");
//   } catch (error) {
//     console.error("MongoDB connection error:", error);
//     process.exit(1); // Exit process with failure
//   }
// }

// async function main() {
//   await connectDB();
// //   await generate(doc_count, id);
//   //   mongoose.connection.close();
// }

// main();

// const doc_count = 30;
// const id = "6672b9ced3d6fdaf5d15865d";
// const daysMonth = 30;

// // async function generate(count, id) {
// //   for (let i = 0; i < count; i++) {
// //     const newPupil = new PupilModel({
// //       firstname: faker.person.firstName(),
// //       lastname: faker.person.lastName(),
// //       parent: {
// //         fullname: faker.person.fullName(),
// //         phone: faker.phone.number(),
// //       },
// //       img: faker.string.hexadecimal(),
// //       phone: faker.phone.number(),
// //       address: faker.location.country(),
// //       password: faker.string.alphanumeric(),
// //       birthCertificate: faker.string.binary(),
// //       group: id,
// //     });
// //     console.log(newPupil);
// //     await newPupil.save();
// //   }
// // }

// // async function generate(id, daysCount) {
// //   //   for (let i = 0; i < count; i++) {
// //   const groups = await GroupModel.find();
// //   for (let m = 0; m < groups.length; m++) {
// //     const { _id } = groups[m];

// //     const pupils = await PupilModel.find({ group: _id });

// //     for (let k = 0; k < pupils.length; k++) {
// //       const { _id } = pupils[k];

// //       for (let j = 0; j < daysCount; j++) {
// //         const newCheckout = new CheckoutModel({
// //           pupil: _id,
// //           checkIn: `2024-06-${String(j + 1).padStart(2, "0")} 07:18`,
// //           checkOut: `2024-06-${String(j + 1).padStart(2, "0")} 12:31`,
// //         });
// //         console.log(newCheckout, j);
// //         await newCheckout.save();
// //       }
// //     }
// //   }
// //   //   }
// // }

// // generate(id, daysMonth);

// async function generate(id, daysCount) {
//   //   for (let i = 0; i < count; i++) {

//   const pupils = await PupilModel.find({ group: id });

//   for (let k = 0; k < pupils.length; k++) {
//     const { _id } = pupils[k];

//     for (let j = 0; j < daysCount; j++) {
//       const newCheckout = new CheckoutModel({
//         pupil: _id,
//         checkIn: `2024-06-${String(j + 1).padStart(2, "0")} 07:18`,
//         checkOut: `2024-06-${String(j + 1).padStart(2, "0")} 12:31`,
//       });
//       console.log(newCheckout, j);
//       await newCheckout.save();
//     }
//   }
//   //   }
// }

// generate(id, daysMonth);
