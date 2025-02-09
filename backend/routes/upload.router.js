import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
    
      const albumTitle = req.body.title || 'default';
      const albumFolderName = `${albumTitle.replace(/\s+/g, '_')}`;
      const uploadPath = path.join(__dirname, '..','..', 'uploads', albumFolderName);


    if(!fs.existsSync(uploadPath)){
      fs.mkdirSync(uploadPath, {recursive: true});
    }

    cb(null, uploadPath);
  } catch (error) {
    console.error('Error in destination function:', error);
    cb(error, false);
    }
  },
  filename: (req, file, cb) => {
    const originalname = path.basename(file.originalname);
    cb(null, originalname);
  },
});

const fileFilter = ( req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if(allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, Only JPEG, PNG, GIF, and WEP allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

export const uploadMiddleware = upload.fields([
  { name: "cover", maxCount: 1 }, 
  { name: "images" }
]);


export default upload;