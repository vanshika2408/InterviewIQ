import multer from "multer";

const storage = multer.memoryStorage();

// Resume upload
const resumeFileFilter = (req, file, cb) => {
  if (file.mimetype !== "application/pdf") {
    return cb(new Error("Only PDF files are allowed."));
  }

  cb(null, true);
};

export const uploadResume = multer({
  storage,
  fileFilter: resumeFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// Voice/audio upload
const audioFileFilter = (req, file, cb) => {
  const allowed = [
    "audio/webm",
    "audio/wav",
    "audio/mpeg",
    "audio/mp4",
    "audio/ogg",
  ];

  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Unsupported audio format."));
  }

  cb(null, true);
};

export const uploadAudio = multer({
  storage,
  fileFilter: audioFileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});