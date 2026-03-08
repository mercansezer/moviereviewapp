const { sendError } = require("../utils/helper");
const cloudinary = require("cloudinary").v2;
const Movie = require("../models/movie");
const { isValidObjectId } = require("mongoose");
const { move } = require("../routes/movie");

exports.uploadTrailer = async (req, res) => {
  const { file } = req;

  //If there is no file(video) send error
  if (!file) return sendError(res, "Video file is missing!");

  //Upload file to cloduinary
  console.log("a");
  const videoRes = await cloudinary.uploader.upload(file.path, {
    resource_type: "video",
  });

  const { public_id, secure_url: url } = videoRes;
  console.log(url);

  res.status(200).json({
    message: "success",
    data: {
      url,
      public_id,
    },
  });
};

exports.createMovie = async (req, res) => {
  const { file, body } = req;

  const {
    title,
    storyLine,
    director,
    releaseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writers,
    poster,
    trailer,
    reviews,
    language,
  } = body;

  const newMovie = new Movie({
    title,
    storyLine,
    releaseDate,
    status,
    type,
    genres,
    tags,
    cast,
    poster,
    trailer,
    language,
  });

  if (director) {
    if (!isValidObjectId(director))
      return sendError(res, "Invalid director id");
    newMovie.director = director;
  }
  if (writers) {
    for (let writerId of writers) {
      if (!isValidObjectId(writerId)) {
        return sendError(res, "Invalid writer id");
      }
    }

    newMovie.writers = writers;
  }

  if (file) {
    //Uploading Poster
    const cloudRes = await cloudinary.uploader.upload(file.path, {
      transformation: [
        { quality: "auto" }, // Automatically compresses the image to best quality vs size
        { fetch_format: "auto" }, // Automatically chooses the best format (like WebP, AVIF)
      ],
      responsive_breakpoints: {
        create_derived: true, // This tells Cloudinary to generate different-sized images
        bytes_step: 20000, // Minimum size difference between each derived image (20KB)
        min_width: 200, // Smallest version to generate (in pixels)
        max_width: 640, // Largest version to generate (in pixels)
        max_images: 3, // Maximum number of versions Cloudinary should generate
      },
    });

    const { secure_url: url, public_id, responsive_breakpoints } = cloudRes; //Responsive breakpoints is an array and includes different secure_url for different size of images. We will save it all of them inside our model. We can reach this array like this. responsive_breakpoints[0]+

    const { breakpoints } = responsive_breakpoints[0];

    const finalPoster = { url, public_id, responsive: [] };

    if (breakpoints.length > 0) {
      for (const imageObj of breakpoints) {
        finalPoster.responsive.push(imageObj.secure_url);
      }
    }

    newMovie.poster = finalPoster;
  }
  await newMovie.save();

  res.status(201).json({
    id: newMovie._id,
    title,
  });
};

exports.updateMovieWithoutPoster = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId))
    return sendError(res, "Invalid object Id!", 404);

  const movie = await Movie.findById(movieId);

  if (!movie) return sendError(res, "There is not movie with this id!");

  const {
    title,
    storyLine,
    director,
    releaseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writers,

    trailer,
    reviews,
    language,
  } = body;

  if (director) {
    if (!isValidObjectId(director))
      return sendError(res, "Invalid director id");
    movie.director = director;
  }
  if (writers) {
    for (let writerId of writers) {
      if (!isValidObjectId(writerId)) {
        return sendError(res, "Invalid writer id");
      }
    }

    movie.writers = writers;
  }

  movie.title = title;
  movie.storyLine = storyLine;
  movie.tags = tags;
  movie.releaseDate = releaseDate;
  movie.status = status;
  movie.type = type;
  movie.genres = genres;
  movie.cast = cast;
  movie.trailer = trailer;
  movie.language = language;

  await movie.save();

  res.status(200).json({
    message: "movie is updated",
    movie,
  });
};

exports.updateMovieWithPoster = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId))
    return sendError(res, "Invalid object Id!", 404);

  if (!req.file) return sendError(res, "Movie poster is missing!");

  const movie = await Movie.findById(movieId);

  if (!movie) return sendError(res, "There is not movie with this id!");

  const {
    title,
    storyLine,
    director,
    releaseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writers,
    trailer,
    reviews,
    language,
  } = body;

  if (director) {
    if (!isValidObjectId(director))
      return sendError(res, "Invalid director id");
    movie.director = director;
  }
  if (writers) {
    for (let writerId of writers) {
      if (!isValidObjectId(writerId)) {
        return sendError(res, "Invalid writer id");
      }
    }

    movie.writers = writers;
  }

  movie.title = title;
  movie.storyLine = storyLine;
  movie.tags = tags;
  movie.releaseDate = releaseDate;
  movie.status = status;
  movie.type = type;
  movie.genres = genres;
  movie.cast = cast;
  movie.trailer = trailer;
  movie.language = language;

  //Update Poster
  //removing the poster from cloud if there is any.
  const { public_id } = movie.poster?.public_id;
  if (public_id) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (!result !== "ok") {
      return sendError(res, "Could not update poster at this moment!");
    }
  }

  const cloudRes = await cloudinary.uploader.upload(req.file.path, {
    transformation: [
      { quality: "auto" }, // Automatically compresses the image to best quality vs size
      { fetch_format: "auto" }, // Automatically chooses the best format (like WebP, AVIF)
    ],
    responsive_breakpoints: {
      create_derived: true, // This tells Cloudinary to generate different-sized images
      bytes_step: 20000, // Minimum size difference between each derived image (20KB)
      min_width: 200, // Smallest version to generate (in pixels)
      max_width: 640, // Largest version to generate (in pixels)
      max_images: 3, // Maximum number of versions Cloudinary should generate
    },
  });

  const {
    secure_url: url,
    public_id: newPublicId,
    responsive_breakpoints,
  } = cloudRes; //Responsive breakpoints is an array and includes different secure_url for different size of images. We will save it all of them inside our model. We can reach this array like this. responsive_breakpoints[0]+

  const { breakpoints } = responsive_breakpoints[0];

  const finalPoster = { url, public_id: newPublicId, responsive: [] };

  if (breakpoints.length > 0) {
    for (const imageObj of breakpoints) {
      finalPoster.responsive.push(imageObj.secure_url);
    }
  }

  newMovie.poster = finalPoster;

  await movie.save();

  res.status(200).json({
    message: "movie is updated",
    movie,
  });
};

exports.deleteMovie = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) return sendError(res, "Invalid object id!");

  const movie = await Movie.findById(movieId);

  if (!movie) return sendError(res, "There is not movie with this id!");

  const { public_id: trailerId } = movie.trailer;

  const { public_id: posterId } = movie.poster;

  if (trailerId) {
    const { result } = await cloudinary.uploader.destroy(trailerId, {
      resource_type: "video",
    });

    if (result !== "ok")
      return sendError(res, "Tailer could not be removed from the cloud !");
  }
  if (posterId) {
    const { result } = await cloudinary.uploader.destroy(posterId);
    if (result !== "ok")
      return sendError(res, "Poster could not be removed from the cloud !");
  }

  const deletedMovie = await Movie.deleteOne(movie._id);

  console.log(movie);
  res.status(200).json({
    status: "success",
  });
};
