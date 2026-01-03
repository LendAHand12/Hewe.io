require("dotenv").config();
const mongoose = require("mongoose");

// const dbUrl = process.env.DB_URL;
const dbUrl = process.env.DB_URL;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(dbUrl);

    console.log("DATABASE CONNECTED");

    connection = mongoose.connection;
    return connection;
  } catch (err) {
    console.error("DATABASE CONNECTION FAILED");
    console.error(err.message);
  }
};

module.exports = { connectToDatabase };
