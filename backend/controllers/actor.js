const { isValidObjectId } = require("mongoose");
const Actor = require("../models/actor");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const { sendError } = require("../utils/helper");

dotenv.config({
  path: "./.env",
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true, //Whenever we upload an image files inside cloudinary what it will do it will create our URL with HTTPS which is more secure than HTTP
});
exports.createActor = async (req, res) => {
  const { name, about, gender } = req.body;

  console.log(about);

  const { file } = req; //const file = req.file --> this two are the same.
  //1) Create actor but don't save

  const newActor = new Actor({ name, about, gender });
  if (file) {
    //2) Upload the image inside cloudinary and take the scure_url and public_id
    const result = await cloudinary.uploader.upload(file.path, {
      gravity: "face",
      height: 500,
      width: 500,
      crop: "thumb",
    });

    const { secure_url, public_id } = result;
    //3) Create the newActor inside mongodb database
    newActor.avatar = { url: secure_url, public_id };
  }
  await newActor.save();
  //4) Send result to client

  res.status(201).json({
    message: "Actor created successfully",
    data: {
      id: newActor._id,
      name: newActor.name,
      about: newActor.about,
      gender: newActor.gender,
      avatar: newActor.avatar?.url,
    },
  });
};

exports.updateActor = async (req, res) => {
  const { name, about, gender } = req.body;

  const { file } = req;
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return sendError(res, "Invalid request!");
  }

  const actor = await Actor.findById(id);
  if (!actor) return sendError(res, "Invalid request, record not found!");

  const public_id = actor.avatar?.public_id;

  //Sadece file varsa yani file gelmişsse demekki değişmek istiyor resmi.
  if (public_id && file) {
    //Remove the old image
    const { result } = await cloudinary.uploader.destroy(public_id);

    if (result !== "ok") {
      return sendError(res, "Could not remove image from cloud!");
    }
  }

  if (file) {
    const result = await cloudinary.uploader.upload(file.path, {
      gravity: "face",
      height: 500,
      width: 500,
      crop: "thumb",
    });
    const { secure_url, public_id } = result;
    actor.avatar = { url: secure_url, public_id };
  }
  actor.name = name;
  actor.about = about;
  actor.gender = gender;

  await actor.save();

  res.status(200).json({
    message: "Actor updated successfully",
    data: {
      id: actor._id,
      name: actor.name,
      about: actor.about,
      gender: actor.gender,
      avatar: actor.avatar?.url,
    },
  });
};

exports.deleteActor = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return sendError(res, "Invalid request!");
  }

  const actor = await Actor.findById(id);

  if (!actor) return sendError(res, "Record not found!");

  const deletedActor = await Actor.findByIdAndDelete(id);

  const public_id = actor.avatar?.public_id;

  if (public_id) {
    const { result } = await cloudinary.uploader.destroy(public_id);

    if (result !== "ok") {
      return sendError(res, "Could not remove image from cloud!");
    }
  }

  res.status(200).json({
    status: "success",
    message: "Actor deleted",
  });
};

exports.searchActor = async (req, res) => {
  const { query } = req;

  console.log(query.name);

  const actor = await Actor.find({
    name: { $regex: query.name, $options: "i" }, // i → case-insensitive
  });

  res.status(200).json({
    status: "success",
    results: actor,
  });
};

exports.getLatestActors = async (req, res) => {
  const result = await Actor.find().sort({ createdAt: -1 }).limit(12);

  res.status(200).json({
    status: "success",
    data: {
      result,
    },
  });
};

exports.getSingleActor = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return sendError(res, "Invalid request!");
  }

  const actor = await Actor.findById(id);
  if (!actor) return sendError(res, "Record not found with this id !");

  res.status(200).json({
    status: "success",
    data: {
      actor,
    },
  });
};
