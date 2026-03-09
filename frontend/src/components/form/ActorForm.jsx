import { act, useState } from "react";
import { commonInputClasses } from "../../../utils/theme";
import PosterSelector from "../PosterSelector";
import Selector from "../Selector";
import { genderOptions } from "../../../utils/options";
import { ImSpinner3 } from "react-icons/im";

const defaultActorInfo = {
  name: "",
  gender: "",
  about: "",
  avatar: null,
};
function ActorForm({ title, btnTitle, onSubmit, busy }) {
  const [actorInfo, setActorInfo] = useState({ ...defaultActorInfo });
  const [selectedAvatarForUI, setSelectedAvatarForUI] = useState("");

  const { name, gender, about, avatar } = actorInfo;

  function handleChange({ target }) {
    const { value, name, files } = target;

    if (name === "avatar") {
      const avatar = files[0];

      setSelectedAvatarForUI(URL.createObjectURL(avatar));

      return setActorInfo((pre) => ({ ...pre, avatar }));
    }

    setActorInfo((pre) => ({ ...pre, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !gender || !about || !avatar.type?.startsWith("image")) return;
    onSubmit(actorInfo);

    setActorInfo({ ...defaultActorInfo });
  }

  return (
    <div
      className="dark:bg-primary bg-white p-3 w-[35rem]"
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
    >
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center">
          <h1 className="font-semibold text-xl dark:text-white text-primary">
            {title}
          </h1>
          <button
            type="submit"
            className="px-3 py-1 bg-primary text-white dark:bg-white dark:text-primary hover:opacity-80 transition cursor-pointer rounded"
          >
            {busy ? <ImSpinner3 className="animate-spin" /> : btnTitle}
          </button>
        </div>
        <div className="flex space-x-2">
          <div className="w-[160px]">
            <PosterSelector
              name="avatar"
              selectedPoster={selectedAvatarForUI}
              onChange={handleChange}
              accept="image/jpg, image/jpeg, image/png"
              label="Select avatar"
            />
          </div>
          <div className="flex flex-col gap-3 flex-grow">
            <input
              onChange={handleChange}
              placeholder={busy ? "Working on it..." : "Enter name"}
              disabled={busy}
              value={name}
              type="text"
              className={commonInputClasses + " border-b-2"}
              name="name"
            />
            <textarea
              placeholder={busy ? "Working on it..." : "About"}
              disabled={busy}
              value={about}
              onChange={handleChange}
              name="about"
              className={
                commonInputClasses +
                " border-b-2 resize-none h-full bg-transparent"
              }
            ></textarea>
            <Selector
              name="gender"
              value={gender}
              label="Gender"
              options={genderOptions}
              onChange={handleChange}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default ActorForm;
