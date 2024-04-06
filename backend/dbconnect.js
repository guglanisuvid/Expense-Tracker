const mongoose = require("mongoose");

mongoose.connection.on("open", () => {
  console.log("DATABSE CONNECTED SUCCESSFULLY");
});

mongoose.connection.on("disconnect", () => {
  console.log("DATABSE DISCONNECTED");
});

mongoose.connection.on("error", (err) => {
  console.log("DATABASE ERROR :");
  console.log(err);
});

// On program exit
process.on("SIGINT", () => {
  console.log("CLOSING DB CONNECTION");
  mongoose.connection.close();
});

// Connecting to database
mongoose.connect(process.env.DB_CONNECTION_STRING);
