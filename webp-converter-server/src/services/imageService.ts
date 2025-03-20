import sharp from 'sharp';

export class ImageService {
  /**
   * Convierte una imagen a formato WebP
   */
  static async convertToWebp(buffer: Buffer): Promise<Buffer> {
    return await sharp(buffer).webp().toBuffer();
  }

  // Podrías añadir otros métodos para diferentes formatos o ajustes
  // static async convertToJpeg(buffer: Buffer): Promise<Buffer> {...}
  // static async resizeImage(buffer: Buffer, width: number, height: number): Promise<Buffer> {...}
}
