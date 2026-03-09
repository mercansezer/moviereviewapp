import { FileUploader } from "react-drag-drop-files";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useNotification } from "../../hooks";
import { uploadTrailer } from "../../api/movie";
import { useRef, useState } from "react";
import MovieForm from "./MovieForm";
import ModalContainer from "../Modals/ModalContainer";
const fileTypes = ["mp4", "avi"];

function MovieUpload({ visible, onClose }) {
  const { updateNotification } = useNotification();
  const [videoSelected, setVideoSelected] = useState(false);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const ref = useRef();
  const [videoInfo, setVideoInfo] = useState({
    trailer: { url: "", public_id: "" },
  });

  async function handleUploadTrailer(formData) {
    setVideoSelected(true);
    const { error, data } = await uploadTrailer(formData, setUploadProgress);

    const { url, public_id } = data;
    if (!error) {
      setVideoUploaded(true);
    }

    setVideoInfo({ trailer: { url, public_id } });
  }

  function handleChange(file) {
    const formData = new FormData();

    formData.append("video", file);
    handleUploadTrailer(formData);
  }

  function handleTypeError(error) {
    updateNotification("error", error);
  }
  function handleSubmit(data) {
    console.log(data);
  }
  return (
    <ModalContainer visible={visible} onClose={onClose}>
      {videoSelected && (
        <UploadProgress
          ref={ref}
          width={uploadProgress}
          videoUploaded={videoUploaded}
          message={`${
            !videoUploaded && uploadProgress >= 100
              ? "Proccessing"
              : `Upload progess ` + uploadProgress
          }`}
        />
      )}

      <TrailerSelector
        onTypeError={handleTypeError}
        onChange={handleChange}
        videoSelected={videoSelected}
      />
      <MovieForm onSubmit={handleSubmit} />
    </ModalContainer>
  );
}

export default MovieUpload;

function TrailerSelector({ onChange, onTypeError, videoSelected }) {
  if (videoSelected) return null;
  return (
    <div className="flex justify-center items-center h-full">
      <FileUploader
        handleChange={onChange}
        onTypeError={onTypeError}
        name="file"
        types={fileTypes}
      >
        <div className="flex flex-col items-center rounded-full w-48 h-48 border border-dashed  dark:border-dark-subtle border-light-subtle justify-center dark:text-dark-subtle text-secondary cursor-pointer">
          <AiOutlineCloudUpload size={48} />
          <p>Drop your file here!</p>
        </div>
      </FileUploader>
    </div>
  );
}

function UploadProgress({ width, message, videoUploaded }) {
  if (videoUploaded) return null;
  return (
    <div className="shadow-2xl  h-[50px] w-[620px] mx-auto dark:bg-secondary mt-1 flex flex-col justify-center ">
      <div className="bg-black/70 dark:bg-dark-subtle h-[20px] w-full relative">
        <div
          style={{ width: width + "%" }}
          className="dark:bg-white bg-black absolute h-[20px] left-0"
        />
      </div>
      <p className="font-semibold dark:text-dark-subtle text-light-subtle animate-pulse">
        {message}
      </p>
    </div>
  );
}
