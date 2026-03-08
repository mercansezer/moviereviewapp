const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const emailVerificationTokenSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", //user model'ını User diye oluşturduk. ref: "User" ise bu ObjectId'nin hangi koleksiyona işaret ettiğini söylüyor. Yani burada User modeli (koleksiyonu) belirtiyoruz.
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 3600, //3600 saniye. 3600/60 = 1 hour.
    default: Date.now(),
  },
});

//this.isModified(fieldName) is a Mongoose document method that checks if the specified field (fieldName) has been changed since the document was loaded or created. It returns true if the field was modified, and false otherwise. This is useful in middleware (like pre('save')) to conditionally run code only when certain fields have been updated — for example, hashing a password or token only when it is newly set or changed.
emailVerificationTokenSchema.pre("save", async function (next) {
  if (this.isModified("token")) {
    this.token = await bcrypt.hash(this.token, 10);
  }
  next();
});
// This compareToken method can be accessed by instances (documents) of the model.
emailVerificationTokenSchema.methods.compareToken = async function (token) {
  const result = bcrypt.compare(token, this.token);
  return result;
};

module.exports = mongoose.model(
  "EmailVerificationToken",
  emailVerificationTokenSchema
);
