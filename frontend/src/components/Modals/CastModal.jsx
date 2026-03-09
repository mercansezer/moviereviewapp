import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import ModalContainer from "./ModalContainer";

function CastModal({ profiles = [], visible, onClose, onRemoveCast }) {
  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer={true}>
      <div
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        className="space-y-2 dark:bg-primary bg-white rounded max-w-[45rem] max-h-[40rem] overflow-auto p-2 custom-scroll-bar"
      >
        {profiles.map(({ profile, roleAs, leadActor }) => {
          const { _id, avatar, name } = profile;
          return (
            <div key={_id} className="flex items-center gap-3 w-[25rem]">
              <img
                className="w-16 h-16 object-cover aspect-square"
                src={avatar.url}
                alt={name}
              />

              <span className="font-semibold dark:text-white text-primary">
                {name}
              </span>
              <span className="text-sm dark:text-dark-subtle text-light-subtle">
                {roleAs}
              </span>
              {leadActor && (
                <AiOutlineCheck className="dark:text-dark-subtle text-light-subtle" />
              )}
              <button
                className="ml-auto cursor-pointer dark:text-dark-subtle text-light-subtle"
                onClick={() => {
                  onRemoveCast(_id);
                }}
              >
                <AiOutlineClose />
              </button>
            </div>
          );
        })}
      </div>
    </ModalContainer>
  );
}

export default CastModal;
