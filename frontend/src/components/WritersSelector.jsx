import { useState } from "react";
import { renderItem } from "../../utils/utilty";
import { useNotification, useSearch } from "../hooks";
import LiveSearch from "./admin/LiveSearch";
import { searchActor } from "../api/actor";

function WritersSelector({ onSetMovieInfo, movieInfo }) {
  const [writerProfile, setWriterProfile] = useState([]);
  const [value, setValue] = useState("");

  const { updateNotification } = useNotification();
  const { handleSearch } = useSearch();

  function handleChange(v) {
    setValue(v);
    handleSearch(searchActor, v, setWriterProfile);
  }

  function handleUpdateWriters(profile) {
    if (!profile) return;
    if (movieInfo.writers.includes(profile))
      return updateNotification("warning", "This profile is already selected!");
    onSetMovieInfo((pre) => ({ ...pre, writers: [...pre.writers, profile] }));
  }
  return (
    <div>
      <LiveSearch
        name="writers"
        results={writerProfile}
        placeholder="Search writer"
        renderItem={renderItem}
        handleProfileChange={handleChange}
        onSelect={handleUpdateWriters}
      />
    </div>
  );
}

export default WritersSelector;
