const mongoose = require("mongoose");

const actorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    about: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    gender: {
      type: String,
      trim: true,
      required: true,
    },
    avatar: {
      type: Object,
      url: String,
      public_id: String,
    },
  },
  { timestamps: true }
  // timestamps: true ⇒ Bu ayarı ekleyince Mongoose otomatik olarak her dökümanda
  // "createdAt" ve "updatedAt" adında iki tarih alanı oluşturur.
  // - createdAt: dokümanın ilk ne zaman oluşturulduğunu gösterir
  // - updatedAt: en son ne zaman güncellendiğini gösterir
  // Bu alanlar özellikle sıralama, log tutma ve değişim takibi için çok faydalıdır.
);

// Index, veritabanında belirli alanlara göre yapılan aramaları hızlandırmak için kullanılır.
// Büyük veri kümelerinde, özellikle sık arama yapılan alanlara index tanımlamak sorgu performansını ciddi şekilde artırır.
// Bu örnekte name alanına "text" index verildi; bu sayede full-text (metin içinde geçen) arama yapılabilir.
// Text index, kelime bazlı arama yapar ve büyük-küçük harf duyarlılığı olmadan çalışır.
// Normalde find({ name: query.name }) ile tam eşleşme aranırken,
// text index ile find({ $text: { $search: query.name } }) şeklinde arama yapılır ve isim içinde geçen tüm ifadeler eşleşir. actor controller'da görebilirsin
actorSchema.index({ name: "text" });

module.exports = mongoose.model("Actor", actorSchema);
