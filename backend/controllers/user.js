const User = require("../models/user");
const jwt = require("jsonwebtoken");
const EmailVerificationToken = require("../models/emailVerificationTokenSchema");
const PassworResetToken = require("../models/passwordResetToken");
const { isValidObjectId } = require("mongoose");
const { generateOTP, generateMailTransporter } = require("../utils/mail");
const { sendError, generateRandomByte } = require("../utils/helper");
const passwordResetToken = require("../models/passwordResetToken");

exports.create = async (req, res) => {
  const { name, email, password } = req.body;

  //Check if there is any user with the email.
  const oldUser = await User.findOne({ email });
  //if there is, send this message as response.
  if (oldUser) return sendError(res, "This email is already in use!");
  //if there is not then create the new user.
  const newUser = new User({ name, email, password });

  //To create documents in our database.
  await newUser.save();

  //Generate 6 digit OTP (One-Time Password)
  const OTP = generateOTP();

  //Store OTP inside our db
  const newEmailVerificationToken = new EmailVerificationToken({
    owner: newUser._id,
    token: OTP,
  });

  await newEmailVerificationToken.save();

  //Send that OTP to our user
  var transport = generateMailTransporter();

  transport.sendMail({
    from: "verification@reviewapp.com",
    to: newUser.email,
    subject: "Email Verification",
    html: `<p>Your verification OTP</p> 
    <h1>${OTP}</h1>`,
  });

  res.status(201).json({
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
  });
};

exports.verifyEmail = async (req, res) => {
  const { userId, OTP } = req.body;

  //Check whether the userId is valid format or not.
  if (!isValidObjectId(userId)) {
    return res.json({
      error: "Invalid user!",
    });
  }
  //Check whether there is any user with this id or not.
  const user = await User.findById(userId);
  if (!user) {
    return sendError(res, "User not found!", 404); //404 means not found
  }
  //Check if the user is verified or not.
  if (user.isVerified) {
    return sendError(res, "User is already verified!");
  }
  //Take the token and check if there is token in DB.
  const token = await EmailVerificationToken.findOne({
    owner: userId,
  });
  if (!token) {
    return sendError(res, "token not found !");
  }
  //Compare the coming token and the hashed token in DB. for that create a methods inside emailVerificationTokenSchema to do that use this inside email verificationTokenSchema.js emailVerificationTokenSchema.methods.compareToken = function(){write the logid here.}
  const isMatched = await token.compareToken(OTP);
  if (!isMatched) return sendError(res, "Please submit a valid OTP");

  //If the comparison is true then make the user.isVerified true.
  user.isVerified = true;
  await user.save();

  //Delete the token inside the database.
  await EmailVerificationToken.findByIdAndDelete(token._id);
  //Send the response
  var transport = generateMailTransporter();

  transport.sendMail({
    from: "verification@reviewapp.com",
    to: user.email,
    subject: "Email Verification",
    html: `<h1>Welcome to our app and thanks for choosing us.</h1>`,
  });
  const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      token: jwtToken,
      isVerified: user.isVerified,
      role: user.role,
    },
    message: "Your mail is verified",
  });
};

exports.resendEmailVerificationToken = async (req, res) => {
  //Take the userId
  const { userId } = req.body;

  //Check if there is user or not.
  const user = await User.findById(userId);
  if (!user) {
    return sendError(res, "user not found!", 404);
  }
  //Check if the user is verified
  if (user.isVerified) {
    return sendError(res, "This email is already verified!");
  }
  //Check if there is token, if there is we don't want to create one more.
  const hasAlreadyToken = await EmailVerificationToken.findOne({
    owner: userId,
  });

  if (hasAlreadyToken) {
    return sendError(
      res,
      "Only after one hour you can request for another token!",
    );
  }

  //Recreate OTP in DB and Resend the OTP
  const OTP = generateOTP();

  const token = new EmailVerificationToken({
    owner: user._id,
    token: OTP,
  });
  await token.save();

  var transport = generateMailTransporter();
  transport.sendMail({
    from: "verification@reviewapp.com",
    to: user.email,
    subject: "Email Verification",
    html: `<p>Your verification OTP</p> 
    <h1>${OTP}</h1>`,
  });

  res.json({
    message: "New OTP has been sent to your registered email account",
  });
};

exports.forgetPassword = async (req, res) => {
  const { email } = req.body;
  //Check if there is email
  if (!email) {
    return sendError(res, "email is missing");
  }
  //Check if there is user with this email
  const user = await User.findOne({ email });
  if (!user) {
    return sendError(res, "There is not user with this email address");
  }
  //Check if there is already any token
  const hasAlreadyToken = await PassworResetToken.findOne({ owner: user._id });
  if (hasAlreadyToken) {
    return sendError(
      res,
      "Only after one hour you can request for another token!",
    );
  }
  //Generate an OTP but this time use crypto(an internal module inside node.js) It's used to ensure security and unpredictability, especially for things like: Email/phone verification Password reset Two-factor authentication (2FA)
  const token = await generateRandomByte();

  //Create the new generated token inside PasswordResetTokenSchema model and save
  const newPasswordResetToken = await new PassworResetToken({
    owner: user._id,
    token,
  });

  newPasswordResetToken.save();
  console.log(newPasswordResetToken);
  //Prepare a link http link to send the user's email.

  const resetPasswordUrl = `http://localhost:5173/auth/reset-password?token=${token}&id=${user._id}`;

  //Send the mail with the link
  var transport = generateMailTransporter();
  transport.sendMail({
    from: "security@reviewapp.com",
    to: user.email,
    subject: "Email Verification",
    html: `<p>Click here to reset password</p> 
    <a href=${resetPasswordUrl}>Change password</a>`,
  });

  res.json({
    message: "Link sent to your email!",
  });
};

exports.sendResetPasswordTokenStatus = (req, res) => {
  res.json({
    valid: true,
  });
};
exports.resetPassword = async (req, res) => {
  const { newPassword, userId } = req.body;

  //Take the user with this id
  const user = await User.findById(userId);

  //Check if the user tries to use new password, if so don't allow it
  const matched = await user.comparePassword(newPassword);

  if (matched) {
    return sendError(
      res,
      "The new password must be different from the old one!",
    );
  }

  //Change the password in db, it will automatically will hash newPassword baceuse we already wrote middleware to do this. Check user model
  user.password = newPassword;
  await user.save();
  //Remove the password reset token in db.
  await PassworResetToken.findByIdAndDelete(req.resetToken._id);

  //Send the message
  const transport = generateMailTransporter();
  transport.sendMail({
    from: "security@reviewapp.com",
    to: user.email,
    subject: "Password Reset Successfully",
    html: `<h1>Password Reset Successfully</h1> 
    <p>Now you can use new password.</p>`,
  });

  res.json({
    message: "Password reset successfully, now you can use new password",
  });
};

exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  //Find the user with this email
  const user = await User.findOne({ email });

  //If there is no user with this email send error
  if (!user) return sendError(res, "Email/Password mismatch!");

  //If there is user then compare the password
  const matched = await user.comparePassword(password);

  //if the password is not matched send error
  if (!matched) return sendError(res, "Email/Password mismatch");

  //If everything is fine then create jwt token and send as response
  const { _id, name, role } = user;

  const jwtToken = jwt.sign({ userId: _id }, process.env.JWT_SECRET);

  res.json({
    user: {
      id: _id,
      name,
      email,
      token: jwtToken,
      isVerified: user.isVerified,
      role: user.role,
    },
  });
};
