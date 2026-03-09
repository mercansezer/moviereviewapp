const commonPosterUI =
  "flex items-center justify-center border border-dashed rounded aspect-square dark:border-dark-subtle border-light-subtle cursor-pointer object-fit:cover";

function PosterSelector({ name, selectedPoster, onChange, accept, label }) {
  return (
    <div>
      <input
        type="file"
        hidden
        id={name}
        name={name}
        onChange={onChange}
        accept={accept}
      />
      <label htmlFor={name}>
        {selectedPoster ? (
          <img
            className={commonPosterUI + " object-fit"}
            src={selectedPoster}
            alt=""
          />
        ) : (
          <PosterUI label={label} />
        )}
      </label>
    </div>
  );
}

export default PosterSelector;

function PosterUI({ label }) {
  return (
    <div className={commonPosterUI}>
      <span className="dark:text-dark-subtle text-light-subtle">{label}</span>
    </div>
  );
}
