import { useState } from "react";
import { commonInputClasses } from "../../../utils/theme";
import LiveSearch from "../admin/LiveSearch";
import { renderItem } from "../../../utils/utilty";
import { useNotification, useSearch } from "../../hooks";
import { searchActor } from "../../api/actor";

const defaultCastInfo = {
  profile: {},
  roleAs: "",
  leadActor: false,
};

function CastForm({ onSubmit }) {
  const [castInfo, setCastInfo] = useState({ ...defaultCastInfo });
  const [castProfile, setCastProfile] = useState([]);

  const { profile, roleAs, leadActor } = castInfo;

  const { handleSearch } = useSearch();
  const { updateNotification } = useNotification();

  function handleOnChange(value, name) {
    handleSearch(searchActor, value, setCastProfile);
  }
  function handleChange({ target }) {
    const { value, name } = target;
    if (name === "roleAs") {
      setCastInfo((pre) => ({ ...pre, [name]: value }));
    }
    if (name === "leadActor") {
      if (leadActor) setCastInfo((pre) => ({ ...pre, leadActor: false }));
      else setCastInfo((pre) => ({ ...pre, leadActor: true }));
    }
  }

  function handleProfileSelect(selectedProfile) {
    setCastInfo((pre) => ({ ...pre, profile: selectedProfile }));
  }

  function handleSubmit() {
    if (!profile.name)
      return updateNotification("error", "Cast profile is missing!");
    if (!roleAs.trim())
      return updateNotification("error", "Cast role is missing!");
    onSubmit(castInfo);

    setCastInfo({ ...defaultCastInfo });
  }

  return (
    <div className="flex space-x-2 items-center">
      <input
        type="checkbox"
        name="leadActor"
        className="h-5 w-5"
        checked={leadActor}
        onChange={handleChange}
        title="Set as lead actor"
      />
      <LiveSearch
        name="actor"
        placeholder="Search profile"
        results={castProfile}
        renderItem={renderItem}
        value={profile?.name ? profile.name : ""}
        onSelect={handleProfileSelect}
        handleProfileChange={handleOnChange}
      />
      <span className="font-semibold dark:text-dark-subtle text-light-subtle">
        as
      </span>
      <div>
        <input
          className={commonInputClasses + " border-2 rounded p-1"}
          placeholder="Role as"
          type="text"
          name="roleAs"
          value={roleAs}
          onChange={handleChange}
        />
      </div>
      <button
        onClick={handleSubmit}
        type="button"
        className="cursor-pointer dark:text-white bg-secondary text-white p-1 rounded"
      >
        Add
      </button>
    </div>
  );
}

export default CastForm;
