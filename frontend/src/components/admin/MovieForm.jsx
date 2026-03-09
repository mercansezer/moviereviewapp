import TagsInput from "../TagsInput";
import { commonInputClasses } from "../../../utils/theme";
import { useState } from "react";
import Submit from "../form/Submit";
import WritersModal from "../Modals/WritersModal";
import CastForm from "../form/CastForm";
import CastModal from "../Modals/CastModal";
import PosterSelector from "../PosterSelector";
import GenresSelector from "../GenresSelector";
import GenresModal from "../Modals/GenresModal";
import Selector from "../Selector";
import {
  typeOptions,
  languageOptions,
  statusOptions,
} from "../../../utils/options";
import DirectorSelector from "../DirectorSelector";
import WritersSelector from "../WritersSelector";
import { validateMovie } from "../../../utils/validator";

const defaultMovieInfo = {
  title: "",
  storyLine: "",
  tags: [],
  cast: [],
  director: [],
  writers: [],
  releaseDate: "",
  poster: null,
  genres: [],
  type: "",
  language: "",
  status: "",
};

function MovieForm({ onSubmit }) {
  const [movieInfo, setMovieInfo] = useState(defaultMovieInfo);
  const [showWritersModal, setShowWritersModal] = useState(false);
  const [showCastAndCrew, setShowCastAndCrew] = useState(false); //Modal
  const [showGenresModal, setShowGenresModal] = useState(false);
  const [selectedPosterForUI, setSelectedPosterForUI] = useState("");
  const [formError, setFormError] = useState("");

  const {
    title = "",
    storyLine,
    tags,
    cast,
    director,
    writers,
    releaseDate,
    poster,
    genres,
    type,
    language,
    status,
  } = movieInfo;

  function handleChange({ target }) {
    const { name, value, files } = target;

    if (name === "poster") {
      const poster = files[0];
      setSelectedPosterForUI(URL.createObjectURL(poster));
      return setMovieInfo((prev) => ({ ...prev, poster: poster }));
    }
    setMovieInfo((prev) => {
      return { ...prev, [name]: value };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const { error } = validateMovie(movieInfo);

    if (error) return setFormError(error);
    if (!error) setFormError("");

    onSubmit(movieInfo);
  }

  function handleRemoveWriter(writerId) {
    if (writers.length - 1 === 0) setShowWritersModal(false);
    const newWriters = movieInfo.writers.filter(
      (writer) => writer._id !== writerId
    );
    setMovieInfo((pre) => ({ ...pre, writers: newWriters }));
  }

  function handleRemoveCast(castId) {
    if (cast.length - 1 === 0) setShowCastAndCrew(false);
    const newCast = movieInfo.cast.filter((pre) => pre.profile._id !== castId);
    setMovieInfo((pre) => ({ ...pre, cast: newCast }));
  }

  function updateCast(newCast) {
    if (movieInfo.cast.includes(newCast)) return;
    setMovieInfo((pre) => ({ ...pre, cast: [...pre.cast, newCast] }));
  }

  function updateGenres(selectedGenres) {
    setMovieInfo((pre) => ({ ...pre, genres: selectedGenres }));
  }

  return (
    <>
      <div className="flex space-x-3">
        <div className="w-[70%] h-5 space-y-5">
          <div>
            <Label htmlFor="title">Title </Label>
            <input
              value={title}
              onChange={handleChange}
              name="title"
              type="text"
              className={
                commonInputClasses + " border-b-2 font-semibold text-xl"
              }
              id="title"
              placeholder="Titanic"
            />
          </div>
          <div>
            <Label htmlFor="storyLine">Story line</Label>
            <textarea
              value={storyLine}
              name="storyLine"
              onChange={handleChange}
              id="storyLine"
              placeholder="Movie story line..."
              className={commonInputClasses + " border-b-2 h-24 resize-none"}
            ></textarea>
          </div>
          <div>
            <Label>Tags</Label>
            <TagsInput setMovieInfo={setMovieInfo} />
          </div>
          <DirectorSelector onSetMovieInfo={setMovieInfo} />
          <div>
            <div className="flex justify-between">
              <LabelWithBadge htmlFor="writers" badge={writers.length}>
                Writers
              </LabelWithBadge>
              <ViewAllBtn
                onShowModal={setShowWritersModal}
                visible={writers.length}
              >
                View All
              </ViewAllBtn>
            </div>
            <WritersSelector
              onSetMovieInfo={setMovieInfo}
              movieInfo={movieInfo}
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <LabelWithBadge badge={movieInfo.cast.length}>
                Add Cast & Crew
              </LabelWithBadge>
              <ViewAllBtn
                visible={movieInfo.cast.length}
                onShowModal={setShowCastAndCrew}
              >
                View All
              </ViewAllBtn>
            </div>
            <CastForm onSubmit={updateCast} />
          </div>
          <input
            value={releaseDate}
            name="releaseDate"
            type="date"
            className={commonInputClasses + " rounded p-1 border-2"}
            onChange={handleChange}
          />

          <div>
            <Submit value="Upload" onClick={handleSubmit} type="button" />
          </div>
        </div>
        <div className="w-[30%] space-y-5">
          <PosterSelector
            name="poster"
            onChange={handleChange}
            selectedPoster={selectedPosterForUI}
            accept="image/jpg, image/jpeg, image/png"
            label="Select poster"
          />
          <div>
            <GenresSelector
              onClick={() => setShowGenresModal(true)}
              badge={genres.length}
            />
          </div>
          <Selector
            label="Type"
            options={typeOptions}
            name="type"
            value={type}
            onChange={handleChange}
          />
          <Selector
            label="Language"
            value={language}
            options={languageOptions}
            name="language"
            onChange={handleChange}
          />
          <Selector
            label="Status"
            value={status}
            options={statusOptions}
            name="status"
            onChange={handleChange}
          />
          <div className="h-[100px] flex items-center justify-center">
            <span className="text-red-500 font-semibold text-[16px] ">
              {formError ? `${formError}` : ""}
            </span>
          </div>
        </div>
      </div>
      <WritersModal
        onRemoveWriter={handleRemoveWriter}
        profiles={writers}
        visible={showWritersModal}
        onClose={() => setShowWritersModal(false)}
      />
      <CastModal
        profiles={cast}
        visible={showCastAndCrew}
        onClose={() => setShowCastAndCrew(false)}
        onRemoveCast={handleRemoveCast}
      />
      <GenresModal
        previousSelected={genres}
        visible={showGenresModal}
        onSubmit={updateGenres}
        onClose={() => {
          setShowGenresModal(false);
        }}
      />
    </>
  );
}

export default MovieForm;

const Label = ({ children, htmlFor }) => {
  return (
    <label
      htmlFor={htmlFor}
      className="dark:text-dark-subtle text-light-subtle "
    >
      {children}
    </label>
  );
};

const LabelWithBadge = ({ children, htmlFor, badge = 0 }) => {
  const renderBadge = () => {
    return (
      <span
        className="absolute -top-1.5 left-12 -translate-y-1.5 dark:bg-dark-subtle bg-light-subtle w-5 h-5 rounded-full flex 
      justify-center items-center"
      >
        {badge <= 9 ? badge : "9+"}
      </span>
    );
  };
  return (
    <div className="relative">
      <label
        htmlFor={htmlFor}
        className="dark:text-dark-subtle text-light-subtle"
      >
        {children}
      </label>
      {badge ? renderBadge() : ""}
    </div>
  );
};

function ViewAllBtn({ children, onShowModal, visible }) {
  if (!visible) return null;
  return (
    <button
      type="button"
      onClick={(e) => {
        onShowModal(e);
      }}
      className="cursor-pointer dark:text-dark-subtle text-light-subtle"
    >
      {children}
    </button>
  );
}
