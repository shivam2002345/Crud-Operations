const mongoose = require("mongoose");

const mongoURI = "mongodb://localhost:27017/inotebook";

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to database successfully");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};

module.exports = connectToMongo;
