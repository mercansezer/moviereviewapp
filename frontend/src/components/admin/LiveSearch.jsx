import { useEffect, useRef, useState } from "react";
import { commonInputClasses } from "../../../utils/theme";
import { useSearch } from "../../hooks";

function LiveSearch({
  results = [],
  placeholder = "",
  renderItem,
  onSelect,
  handleProfileChange,
  name,
}) {
  const [showResults, setShowResults] = useState(false);
  const [focusedIndex, setFocuesIndex] = useState(-1);
  const [defaultValue, setDefaultValue] = useState("");
  const { resetSearch } = useSearch();

  const inputRef = useRef();

  function handleOnFocus() {
    if (results.length) setShowResults(true);
  }

  function handleOnBlur() {
    setShowResults(false);
    setFocuesIndex(-1);
    resetSearch();
  }

  function handleKeyDown({ key }) {
    let nextCount;

    const keys = ["ArrowDown", "ArrowUp", "Escape", "Enter"];

    if (!keys.includes(key)) return;

    if (key === "ArrowDown") {
      if (focusedIndex === results.length - 1) {
        return setFocuesIndex(0);
      }
      nextCount = focusedIndex + 1;
    }
    if (key === "ArrowUp") {
      if (focusedIndex === -1) return;
      if (focusedIndex === 0) {
        return setFocuesIndex(results.length - 1);
      }
      nextCount = focusedIndex - 1;
    }
    if (key === "Enter") {
      setShowResults(false);
      return onSelect(results[focusedIndex]);
    }
    if (key === "Escape") {
      return setShowResults(false);
    }

    setFocuesIndex(nextCount);
  }

  function handleChange(e) {
    const { target } = e;
    const { value, name } = target;
    setDefaultValue(value);

    handleProfileChange(value, name);
  }

  useEffect(
    function () {
      if (results.length) return setShowResults(true);
      setShowResults(false);
    },
    [results.length]
  );
  return (
    <div className="relative">
      <input
        ref={inputRef}
        name={name}
        id={name}
        type="text"
        className={commonInputClasses + " border-2 rounded p-1 text-lg"}
        placeholder={placeholder}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        value={defaultValue}
      />
      <SearchResults
        visible={showResults}
        focusedIndex={focusedIndex}
        onSelect={onSelect}
        renderItem={renderItem}
        results={results}
        onDefaultValue={setDefaultValue}
      />
    </div>
  );
}

const SearchResults = ({
  visible,
  focusedIndex,
  onSelect,
  results,
  renderItem,
  onDefaultValue,
}) => {
  const resultContainer = useRef();
  useEffect(
    function () {
      resultContainer.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    },
    [focusedIndex]
  );
  if (!visible) return null;

  return (
    <div className="absolute right-0 left-0 top-10 bg-white dark:bg-secondary shadow-md p-2 max-h-64 space-y-2 mt-1 overflow-auto custom-scroll-bar z-9999">
      {results.map((result, index) => {
        return (
          <ResultCard
            onSelect={onSelect}
            onDefaultValue={onDefaultValue}
            item={result}
            index={index.toString()}
            focusedIndex={focusedIndex}
            resultContainer={resultContainer}
            key={index}
            renderItem={() => renderItem(result)}
          />
        );
      })}
    </div>
  );
};

function ResultCard({
  onSelect,
  item,
  index,
  focusedIndex,
  resultContainer,
  renderItem,
  onDefaultValue,
}) {
  return (
    <div
      onMouseDown={() => {
        onSelect(item);
        onDefaultValue(item.name);
      }}
      ref={focusedIndex === Number(index) ? resultContainer : null}
      key={item.id}
      className={`cursor-pointer rounded overflow-hidden dark:hover:bg-dark-subtle hover:bg-light-subtle transition flex space-x-2 ${
        focusedIndex === Number(index)
          ? "bg-light-subtle dark:bg-dark-subtle"
          : ""
      }`}
    >
      {renderItem()}
    </div>
  );
}

export default LiveSearch;
