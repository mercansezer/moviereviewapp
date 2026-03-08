const mongoose = require("mongoose");

mongoose
  .connect(process.env.DATABASE)
  .then((con) => {
    console.log("db is connected!");
  })
  .catch((ex) => {
    console.log("db connection failed", ex);
  });
