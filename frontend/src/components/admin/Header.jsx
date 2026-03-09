import { useEffect, useRef, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { IoSunnySharp } from "react-icons/io5";
import { useTheme } from "../../hooks";

function Header({ onAddMovieClick, onAddActorClick }) {
  const [showOptions, setShowOptions] = useState(false);

  const { toggleTheme } = useTheme();

  const ref = useRef();

  const options = [
    {
      title: "Add Movie",
      onClick: onAddMovieClick,
    },
    {
      title: "Add Actor",
      onClick: onAddActorClick,
    },
  ];

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowOptions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="flex items-center justify-between relative">
      <input
        type="text"
        placeholder="Search movies..."
        className="border-2 dark:border-dark-subtle border-light-subtle dark:focus:border-white focus:border-primary dark:text-white transition bg-transparent rounded text-l p-1 outline-none "
      />
      <div className="flex gap-3">
        <button
          className="dark:text-white bg-dark-subtle p-1 rounded cursor-pointer"
          onClick={toggleTheme}
        >
          <IoSunnySharp className="text-secondary cursor-pointer" size={24} />
        </button>
        <button
          className="flex items-center space-x-2 border-secondary hover:border-primary text-secondary hover:opacity-80 transition font-semibold border-2 rounded text-lg cursor-pointer py-1 px-3 dark:text-dark-subtle dark:border-dark-subtle dark:hover:border-dark-subtle"
          onClick={() => setShowOptions(!showOptions)}
        >
          <span>Create</span>
          <AiOutlinePlus />
        </button>
        <CreateOptions
          showOptions={showOptions}
          options={options}
          onClose={() => setShowOptions(false)}
        />
      </div>
    </div>
  );
}

export default Header;

const CreateOptions = ({ showOptions, options, onClose }) => {
  const [visible, setVisible] = useState(showOptions);

  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (showOptions) {
      setVisible(true);
      setClosing(false);
    } else if (visible) {
      setClosing(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setClosing(false);
      }, 200); // animasyon süresi ile aynı olmalı
      return () => clearTimeout(timer);
    }
  }, [showOptions, visible]);

  function handleClick(fn) {
    fn();
    onClose();
  }

  if (!visible) return null;

  return (
    <div
      className={`absolute right-0 top-12 flex flex-col space-y-3 p-5 dark:bg-secondary bg-white drop-shadow-lg rounded
      ${closing ? "animation-scale-reverse" : "animation-scale"}`}
    >
      {options.map(({ title, onClick }) => {
        return (
          <Option key={title} onClick={() => handleClick(onClick)}>
            {title}
          </Option>
        );
      })}
    </div>
  );
};

const Option = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer dark:text-white text-secondary hover:opacity-80 transition"
    >
      {children}
    </button>
  );
};
