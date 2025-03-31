import multer from 'multer';
import fs from 'fs';
import path from 'path';
import {generarId} from '../helpers/tokens.js';
// Ruta donde se guardarán las imágenes
const uploadPath = path.join(process.cwd(), 'public/uploads');

// Verificar si la carpeta existe, si no, crearla
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,'public/uploads/')
    },
    filename: (req,file,cb) => {
        if (file) {
            cb(null, generarId() + path.extname(file.originalname))
          }
        
    }
})

const upload = multer({storage})

export default upload