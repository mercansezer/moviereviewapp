import { useState } from "react";
import genres from "../../../utils/genres";
import ModalContainer from "./ModalContainer";
import Submit from "../form/Submit";

function GenresModal({ visible, onClose, onSubmit, previousSelected }) {
  const [selectedGenres, setSelectedGenres] = useState([]);

  function handleGenresSelector(genre) {
    let newGenres = [];
    if (selectedGenres.includes(genre))
      newGenres = selectedGenres.filter((item) => item !== genre);
    else newGenres = [...selectedGenres, genre];
    setSelectedGenres([...newGenres]);
  }

  function handleClose() {
    onClose();
    setSelectedGenres([...previousSelected]);
  }

  function handleSubmit() {
    onSubmit(selectedGenres);
    onClose();
  }
  return (
    <ModalContainer visible={visible} onClose={handleClose}>
      <div className="flex flex-col h-full">
        <h1 className="dark:text-white text-primary text-2xl font-semibold text-center mb-2">
          Select Genres
        </h1>
        <div className="space-y-3">
          {genres.map((genre, index) => {
            return (
              <Genre
                key={index}
                gen={genre}
                onClick={() => handleGenresSelector(genre)}
                selected={selectedGenres.includes(genre)}
              />
            );
          })}
        </div>
        <div className="w-[200px] ml-auto mt-auto">
          <Submit value="Select" onClick={handleSubmit} className="w-[200px]" />
        </div>
      </div>
    </ModalContainer>
  );
}

function Genre({ gen, selected, onClick }) {
  function getSelectedStyle() {
    return selected
      ? "dark:bg-white dark:text-primary bg-light-subtle text-white"
      : "dark:text-white text-primary";
  }
  return (
    <button
      key={gen}
      type="button"
      className={`${getSelectedStyle()} border-2 dark:border-dark-subtle border-light-subtle p-1 rounded mr-3 cursor-pointer`}
      onClick={onClick}
    >
      {gen}
    </button>
  );
}

export default GenresModal;
