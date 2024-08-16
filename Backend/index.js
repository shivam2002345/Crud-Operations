const connectToMongo = require("./db");
const express = require("express");
var cors = require("cors");

connectToMongo();
const app = express(); // Create an instance of the Express application
const port = 8080;

app.use(cors()); // Use CORS middleware
app.use(express.json()); // Use JSON middleware

//Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
