const mongoose = require("mongoose");

const connectDB = (uri) => {
  return mongoose
    .connect(uri, { dbName: "Viby" })
    .then((data) => {
      console.log(
        `Connected to db: ${data.connection.name} at ${data.connection.host}`
      );
    })
    .catch((error) => {
      throw error;
    });
};

module.exports = { connectDB };
