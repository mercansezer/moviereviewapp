const mongoose = require("mongoose");
const genres = require("../utils/genres");

const movieSchema = new mongoose.Schema(
  {
    // Filmin başlığı
    title: {
      type: String,
      trim: true,
      required: true,
    },
    // Filmin konusu veya hikayesi
    storyLine: {
      type: String,
      trim: true,
      required: true,
    },
    // Filmin yönetmeni, Actor modelinden referans alınır
    director: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Actor",
    },
    // Filmin vizyona giriş tarihi
    releaseDate: {
      type: Date,
      required: true,
    },
    // Filmin erişim durumu: herkese açık mı yoksa özel mi
    status: {
      type: String,
      required: true,
      enum: ["public", "private"],
    },
    // Film mi, dizi mi gibi tür bilgisi
    type: {
      type: String,
      required: true,
    },
    // Filmin ait olduğu türler (aksiyon, dram vs.), dışarıdan gelen sabit bir listeye göre
    genres: {
      type: [String],
      required: true,
      enum: genres,
    },
    // Filmle ilişkili anahtar kelimeler veya etiketler
    tags: {
      type: [String],
      required: true,
    },
    // Oyuncu kadrosu bilgileri (oyuncu, rolü, başrol mü)
    cast: [
      {
        actor: { type: mongoose.Schema.Types.ObjectId, ref: "Actor" },
        roleAs: String,
        leadActor: Boolean,
      },
    ],
    // Senaristlerin listesi (Actor modelinden referans alınır)
    writers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Actor",
      },
    ],
    // Filmin afiş bilgileri (Cloudinary'den gelen url ve public_id)
    poster: {
      type: Object,
      url: { type: String, required: true },
      public_id: { type: String, required: true },
      responsive: [URL],
    },
    // Filmin fragman bilgileri (Cloudinary'den gelen url ve public_id)
    trailer: {
      type: Object,
      url: { type: String, required: true },
      public_id: { type: String, required: true },
      required: true,
    },
    // Filme yapılan yorumların referansları
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    // Filmin dili (örneğin: İngilizce, Türkçe)
    language: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Oluşturulma ve güncellenme zamanları otomatik eklenir
);

module.exports = mongoose.model("Movie", movieSchema);
