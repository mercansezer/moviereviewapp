import { useState } from "react";
import { createActor } from "../../api/actor";
import { useNotification } from "../../hooks";
import ActorForm from "../form/ActorForm";
import ModalContainer from "./ModalContainer";

function ActorUpload({ visible, onClose }) {
  const { updateNotification } = useNotification();

  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(data) {
    setIsLoading(true);
    const formData = new FormData();

    for (let key in data) {
      formData.append(key, data[key]);
    }

    const res = await createActor(formData);

    const { data: newActor, error } = res;

    if (!error) onClose();

    setIsLoading(false);

    updateNotification("success", "The actor was created successfully");
  }
  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer={true}>
      <ActorForm
        title="Create New Actor"
        btnTitle="Create"
        onSubmit={handleSubmit}
        busy={isLoading}
      />
    </ModalContainer>
  );
}

export default ActorUpload;
