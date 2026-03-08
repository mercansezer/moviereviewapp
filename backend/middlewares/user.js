const { isValidObjectId } = require("mongoose");
const { sendError } = require("../utils/helper");
const passwordResetToken = require("../models/passwordResetToken");

exports.isValidPassResetToken = async (req, res, next) => {
  const { token, userId } = req.body;

  //Check the token and userId
  if (!token.trim() || !isValidObjectId(userId)) {
    return sendError(res, "Invalid request!");
  }

  //Take the user's token in database to check whether they are matched
  const resetToken = await passwordResetToken.findOne({ owner: userId });
  if (!resetToken) {
    return sendError(res, "Unauthorized access, Invalid request!");
  }
  //Check if the coming token and in DB token is matched
  const matched = await resetToken.compareToken(token);
  if (!matched) return sendError(res, "Unauthorized access, Invalid request!");

  req.resetToken = resetToken;
  next();
};
