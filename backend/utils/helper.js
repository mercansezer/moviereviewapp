const crypto = require("crypto");

exports.sendError = (res, error, statusCode = 401) => {
  res.status(statusCode).json({ error });
};

exports.generateRandomByte = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(30, (err, buffer) => {
      if (err) return reject(err);
      const buffString = buffer.toString("hex");
      resolve(buffString);
    });
  });
};

exports.handleNotFound = (req, res) => {
  this.sendError(res, "Not found", 404);
};

exports.parseData = (req, res, next) => {
  const { genres, tags, cast, writers, trailer } = req.body;

  if (genres) req.body.genres = JSON.parse(genres);
  if (cast) req.body.cast = JSON.parse(cast);
  if (tags) req.body.tags = JSON.parse(tags);
  if (writers) req.body.writers = JSON.parse(writers);
  if (trailer) req.body.trailer = JSON.parse(trailer);

  next();
};
