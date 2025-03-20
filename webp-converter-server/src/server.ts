import express, { Request, Response } from 'express';
import multer, { memoryStorage } from 'multer';
import cors from 'cors';
import sharp from 'sharp';

const app = express();
const port = 3001;

// Configuración de CORS
app.use(cors());

// Configuración de Multer para manejar la subida de archivos en memoria
const storage = memoryStorage();
const upload = multer({ storage });

// Ruta de conversión
app.post('/convert', upload.single('image'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).send('No se ha subido ningún archivo');
        }

        // Convertir la imagen a WebP
        const webpBuffer = await sharp(req.file.buffer)
            .webp()
            .toBuffer();

        // Configurar las cabeceras de la respuesta
        res.set({
            'Content-Type': 'image/webp',
            'Content-Length': webpBuffer.length.toString()
        });

        // Enviar el buffer convertido
        res.send(webpBuffer);
    } catch (error) {
        console.error('Error en la conversión:', error);
        res.status(500).send('Error al procesar la imagen');
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});