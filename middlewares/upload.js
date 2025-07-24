const multer = require('multer');
const sharp = require('sharp');

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const validMimes = ['image/jpeg', 'image/png', 'image/webp'];
    
    if (validMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo inválido. Use apenas JPEG, PNG ou WebP.'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, 
    files: 1 
  }
});

const processarImagem = async (req, res, next) => {
  if (!req.file) return next();
  
  try {
    req.file.processedImage = {
      data: await sharp(req.file.buffer)
        .resize(800, 600, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .toFormat('jpeg')
        .jpeg({ quality: 80 })
        .toBuffer(),
      contentType: 'image/jpeg'
    };
    
    next();
  } catch (error) {
    console.error('Erro no processamento da imagem:', error);
    next(new Error('Falha ao processar a imagem. O arquivo pode estar corrompido.'));
  }
};

const handleUploadErrors = (err, req, res, next) => {
  if (err) {
    if (err instanceof multer.MulterError) {
      switch (err.code) {
        case 'LIMIT_FILE_SIZE':
          return res.status(400).json({ 
            success: false,
            message: 'Arquivo muito grande (máximo 5MB)'
          });
        case 'LIMIT_FILE_COUNT':
          return res.status(400).json({ 
            success: false,
            message: 'Apenas um arquivo por vez é permitido'
          });
        case 'LIMIT_UNEXPECTED_FILE':
          return res.status(400).json({ 
            success: false,
            message: 'Campo de upload incorreto'
          });
        default:
          return res.status(400).json({ 
            success: false,
            message: 'Erro no upload do arquivo'
          });
      }
    } else if (err.message.includes('Tipo de arquivo inválido')) {
      return res.status(400).json({ 
        success: false,
        message: err.message
      });
    } else {
      console.error('Erro no upload:', err);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno no processamento do arquivo'
      });
    }
  }
  next();
};

module.exports = {
  upload,
  processarImagem,
  handleUploadErrors
};