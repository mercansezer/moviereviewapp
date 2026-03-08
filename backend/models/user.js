const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  role: {
    type: String,
    required: true,
    default: "user",
    enum: ["admin", "user"],
  },
});

//This keyword refers to newly created documents in the database.
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10); //bcrypt.hash() bir Promise döner. await kullanmazsan, next() çağrılmadan önce işlem tamamlanmayabilir.
  }
  next();
});

userSchema.methods.comparePassword = async function (newPassword) {
  const result = await bcrypt.compare(newPassword, this.password);

  return result;
};
module.exports = mongoose.model("User", userSchema);
