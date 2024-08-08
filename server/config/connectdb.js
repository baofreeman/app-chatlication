const mongoose = require("mongoose");

const connect = async (DATABASE_URI) => {
  try {
    await mongoose.connect(DATABASE_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connect;
