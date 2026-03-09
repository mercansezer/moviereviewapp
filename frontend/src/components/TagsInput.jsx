import { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

function TagsInput({ setMovieInfo }) {
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState([]);
  const input = useRef();
  const tagsInput = useRef();

  function handleChange({ target }) {
    const { value } = target;
    if (value !== ",") setTag(value);
  }

  function handleKeyDown({ key }) {
    if (tags.includes(tag)) return setTag("");
    if (key === "Enter" || key === ",") {
      setTags([...tags, tag]);
      setTag("");
    }
    if (key === "Backspace" && !tag) {
      setTags(tags.slice(0, -1));
    }
  }
  useEffect(() => {
    input.current?.scrollIntoView(false);
  }, [tag]);

  useEffect(() => {
    setMovieInfo((pre) => ({ ...pre, ["tags"]: tags }));
  }, [tags, setMovieInfo]);

  function handleRemove(item) {
    const newTags = tags.filter((element) => element !== item);

    setTags([...newTags]);
  }

  function handleOnBlur() {
    tagsInput.current.classList.add(
      "dark:border-dark-subtle",
      "border-light-subtle"
    );
    tagsInput.current.classList.remove("dark:border-white", "border-primary");
  }

  function handleOnFocus() {
    tagsInput.current.classList.remove(
      "dark:border-dark-subtle",
      "border-light-subtle"
    );
    tagsInput.current.classList.add("dark:border-white", "border-primary");
  }
  return (
    <div
      ref={tagsInput}
      onKeyDown={handleKeyDown}
      className="border-2 bg-transparent dark:border-dark-subtle border-light-subtle px-2 h-10 rounded w-full text-white flex items-center space-x-2 overflow-x-auto custom-scroll-bar transition"
      onBlur={handleOnBlur}
      onFocus={handleOnFocus}
    >
      {tags.map((t) => {
        return (
          <Tag key={t} handleRemove={handleRemove} item={t}>
            {t}
          </Tag>
        );
      })}
      <input
        ref={input}
        onMouseDown={(e) => {
          e.stopPropagation(); // MouseDown olayını engelliyoruz
        }}
        type="text"
        value={tag}
        className="h-full flex-grow bg-transparent outline-none dark:text-white text-primary"
        placeholder="Tag one, Tag two"
        onChange={handleChange}
      ></input>
    </div>
  );
}

export default TagsInput;

function Tag({ children, handleRemove, item }) {
  return (
    <span className="dark:bg-white bg-primary dark:text-primary text-white flex items-center text-sm px-1 ">
      {children}
      <button type="button" className="cursor-pointer">
        <AiOutlineClose
          size={12}
          className="mt-0.5"
          onClick={() => handleRemove(item)}
        />
      </button>
    </span>
  );
}
