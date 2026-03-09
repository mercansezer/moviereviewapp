import { createContext, useState } from "react";
import { useNotification } from "../hooks";

export const SearchContext = createContext();

let timeoutId;

function debounce(fn, delay) {
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(null, args);
    }, delay);
  };
}

function SearchProvider({ children }) {
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [resultNotFound, setResultNotFound] = useState(false);
  const { updateNotification } = useNotification();

  const search = async (method, query, updaterFunction) => {
    const { results, error } = await method(query);

    if (error) return updateNotification("error", error);
    if (!results.length) return setResultNotFound(true);

    setResults(results);
    updaterFunction && updaterFunction([...results]);
  };

  const debouncedSearch = debounce(search, 500);

  function handleSearch(method, value, updaterFunction) {
    setSearching(true);
    if (!value.trim()) {
      setResults([]);
      resetSearch();
    }
    debouncedSearch(method, value, updaterFunction);
  }

  function resetSearch() {
    setSearching(false);
    setResults([]);
    setResultNotFound(false);
  }

  return (
    <SearchContext.Provider
      value={{ handleSearch, searching, results, resultNotFound, resetSearch }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export default SearchProvider;
