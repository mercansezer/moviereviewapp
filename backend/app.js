const express = require("express");
require("express-async-handler"); //try catch kullanmana gerek kalmadan direkt olarak error handling fonksiyon içine hatayı atıyor.
//Bu paket, async/await kullandığın route fonksiyonlarında, bir hata oluşursa onu otomatik olarak next(err) ile Express’e iletir.

const userRouter = require("./routes/user");
const actorRouter = require("./routes/actor");
const movieRouter = require("./routes/movie");

const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const { errorHandler } = require("./middlewares/error");
const { handleNotFound } = require("./utils/helper");

dotenv.config({
  path: "./.env",
});
require("./db/index");

const app = express();

app.use(cors());

app.use(express.json());

app.use(morgan("dev"));

app.use("/api/user", userRouter);
app.use("/api/actor", actorRouter);
app.use("/api/movie", movieRouter);

app.all("/{*any}", handleNotFound);

app.use(errorHandler);

app.listen(8000, (req, res) => {
  console.log("Server listening...");
});
