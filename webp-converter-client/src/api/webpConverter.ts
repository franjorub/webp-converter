// src/api/webpConverterClient.ts

import axios, { AxiosProgressEvent } from 'axios';
import { saveAs } from 'file-saver';

export class WebpConverterClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3001/api') {
    this.baseUrl = baseUrl;
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/status`);
      return response.status === 200;
    } catch (error) {
      console.error('Error while checking server status: ', error);
      return false;
    }
  }

  async convertToWebp(
    imageFile: File,
    options: {
      download?: boolean;
      fileName?: string;
      onUploadProgress: (progressEvent: AxiosProgressEvent) => void;
    }
  ): Promise<Blob | void> {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await axios.post<ArrayBuffer>(`${this.baseUrl}/images/convert`, formData, {
        responseType: 'arraybuffer',
        onUploadProgress: options.onUploadProgress,
      });

      const webpBlob = new Blob([response.data], { type: 'image/webp' });

      if (options.download) {
        const fileName = options.fileName ?? imageFile.name.split('.')[0];
        saveAs(webpBlob, `${fileName}.webp`);
        return;
      }

      return webpBlob;
    } catch (error) {
      console.error('Error while converting image: ', error);
      throw new Error('Something went wrong. Please try again later.');
    }
  }
}

export const useWebpConverter = (baseUrl?: string) => {
  const client = new WebpConverterClient(baseUrl);

  return {
    convertToWebp: client.convertToWebp.bind(client),
    checkHealth: client.checkHealth.bind(client),
  };
};
