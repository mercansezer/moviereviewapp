import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "../components/NotFound";
import Dashboard from "../components/admin/Dashboard";
import Movies from "../components/admin/Movies";
import Actors from "../components/admin/Actors";
import Navbar from "../components/admin/Navbar";
import Header from "../components/admin/Header";
import MovieUpload from "../components/admin/MovieUpload";
import { useState } from "react";
import ActorUpload from "../components/Modals/ActorUpload";

function AdminNavigator() {
  const [showMovieUploadModal, setShowMovieUploadModal] = useState(false);
  const [showActorUploadModal, setShowActorUploadModal] = useState(false);

  return (
    <>
      <div className="flex h-screen overflow-hidden dark:bg-primary bg-white ">
        <Navbar />
        <div className="w-[1100px] p-2  overflow-y-auto ">
          <Header
            onAddMovieClick={() => setShowMovieUploadModal(true)}
            onAddActorClick={() => setShowActorUploadModal(true)}
          />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/actors" element={<Actors />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
      <MovieUpload
        onClose={() => setShowMovieUploadModal(false)}
        visible={showMovieUploadModal}
      />
      <ActorUpload
        onClose={() => setShowActorUploadModal(false)}
        visible={showActorUploadModal}
      />
    </>
  );
}

export default AdminNavigator;
