import { useState } from "react";
import { renderItem } from "../../utils/utilty";
import LiveSearch from "./admin/LiveSearch";
import { useSearch } from "../hooks";
import { searchActor } from "../api/actor";
import { Label } from "./Label";

function DirectorSelector({ onSetMovieInfo }) {
  const [value, setValue] = useState("");
  const [directorProfile, setDirectorProfile] = useState([]);

  const { handleSearch, resetSearch } = useSearch();

  function handleUpdateDirector(profile) {
    if (!profile) return;
    onSetMovieInfo((pre) => ({ ...pre, director: profile }));
    setDirectorProfile([]);
    resetSearch();
  }

  function handleDirectorChange(v) {
    setValue(v);
    handleSearch(searchActor, v, setDirectorProfile);
  }
  return (
    <div>
      <Label htmlFor="Director">Director</Label>
      <LiveSearch
        name="director"
        results={directorProfile}
        placeholder="Search profile"
        renderItem={renderItem}
        onSelect={handleUpdateDirector}
        handleProfileChange={handleDirectorChange}
      />
    </div>
  );
}

export default DirectorSelector;
