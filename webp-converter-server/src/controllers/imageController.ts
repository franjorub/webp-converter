import { Request, Response } from 'express';
import { ImageService } from '../services/imageService';

export class ImageController {
  /**
   * Convierte una imagen subida a formato WebP
   */
  static async convertToWebp(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).send('No file was uploaded.');
        return;
      }

      const webpBuffer = await ImageService.convertToWebp(req.file.buffer);

      res.set({
        'Content-Type': 'image/webp',
        'Content-Length': webpBuffer.length.toString(),
      });

      res.send(webpBuffer);
    } catch (error) {
      console.error('Conversion error: ', error);
      res.status(500).send('Error while converting the image.');
    }
  }
}
