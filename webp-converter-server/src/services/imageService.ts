import sharp from 'sharp';

export class ImageService {
  static async convertToWebp(buffer: Buffer): Promise<Buffer> {
    return await sharp(buffer).webp().toBuffer();
  }
}
