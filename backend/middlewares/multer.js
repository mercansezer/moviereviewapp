// Multer, Node.js içinde dosya (resim, PDF, vs.) yüklemeyi sağlayan bir middleware'dir.
const multer = require("multer");
//multer sayesinde controllerda req.file içinde image file görebiliriz.

// DiskStorage, yüklenen dosyanın bilgisayarda nereye kaydedileceğini ayarlamak için kullanılır.
// Burada boş bırakıldı ama ayar yine multer içinde tanımlanıyor.
const storage = multer.diskStorage({});

// File filter fonksiyonu, gelen dosyanın tipini kontrol eder (örneğin sadece image olsun diye)
const imageFileFilter = (req, file, cb) => {
  // Yüklenen dosyanın bilgilerini terminale yazdırır (debug için faydalı)

  // Dosyanın türü "image" ile başlıyorsa devam etsin, değilse hata ver
  if (!file.mimetype.startsWith("image")) {
    // cb'ye ilk parametre hata mesajıdır, ikinci parametre dosyanın kabul edilip edilmeyeceği
    cb("Supported only image files", false); // Hata fırlatılır ve dosya reddedilir
  }

  // Buraya gelirse, dosya uygundur → kabul edilir
  cb(null, true);
};

const videoFileFilter = (req, file, cb) => {
  // Yüklenen dosyanın bilgilerini terminale yazdırır (debug için faydalı)

  // Dosyanın türü "video" ile başlıyorsa devam etsin, değilse hata ver
  if (!file.mimetype.startsWith("video")) {
    // cb'ye ilk parametre hata mesajıdır, ikinci parametre dosyanın kabul edilip edilmeyeceği
    cb("Supported only video files", false); // Hata fırlatılır ve dosya reddedilir
  }

  // Buraya gelirse, dosya uygundur → kabul edilir
  cb(null, true);
};

// Multer middleware'i ayarlıyoruz: storage (dosya kaydetme), fileFilter (dosya kontrolü)
// Artık bu export edilen uploadImage, route'larda middleware olarak kullanılabilir
exports.uploadImage = multer({ storage, fileFilter: imageFileFilter });
exports.uploadVideo = multer({ storage, fileFilter: videoFileFilter });
