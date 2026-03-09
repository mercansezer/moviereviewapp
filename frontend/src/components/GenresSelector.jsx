import { ImTree } from "react-icons/im";

function GenresSelector({ onClick, badge }) {
  const renderBadge = () => {
    if (!badge) return;
    return (
      <span
        className="absolute -top-1 right-0 -translate-y-1.5 dark:bg-dark-subtle bg-light-subtle w-5 h-5 rounded-full flex 
      justify-center items-center"
      >
        {badge <= 9 ? badge : "9+"}
      </span>
    );
  };
  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center space-x-1 py-1 px-3 border-2 dark:border-dark-subtle border-light-subtle dark:hover:border-white hover:border-primary dark:text-dark-subtle transition text-light-subtle dark:hover:text-white hover:text-primary rounded"
      type="button"
    >
      <ImTree />
      <span>Select Genres</span>
      {renderBadge()}
    </button>
  );
}

export default GenresSelector;
