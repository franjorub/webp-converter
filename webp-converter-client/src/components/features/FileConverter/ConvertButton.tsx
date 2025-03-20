import { useFileStore } from '@/store';
import { Button } from '@chakra-ui/react';
import { useState } from 'react';
import axios, { AxiosProgressEvent } from 'axios';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export default function ConvertButton() {
  const files = useFileStore(state => state.files);
  const updateFileProgress = useFileStore(state => state.updateFileProgress);

  const [converting, setConverting] = useState(false);

  const convertFiles = async () => {
    setConverting(true);
    const convertedFiles: Array<{ name: string; data: ArrayBuffer }> = [];

    try {
      await Promise.all(
        files.map(async fileState => {
          const formData = new FormData();
          formData.append('image', fileState.file);

          const response = await axios.post<ArrayBuffer>(
            'http://localhost:3001/convert',
            formData,
            {
              responseType: 'arraybuffer',
              onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                const progress = Math.round(
                  (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
                );
                updateFileProgress(fileState.id, progress);
              },
            }
          );

          convertedFiles.push({
            name: fileState.file.name.replace(/\.jpe?g$/, '.webp'),
            data: response.data,
          });
        })
      );

      if (convertedFiles.length === 1) {
        const file = convertedFiles[0];
        saveAs(new Blob([file.data]), file.name);
      } else {
        const zip = new JSZip();
        convertedFiles.forEach(file => {
          zip.file(file.name, file.data);
        });
        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, 'converted-images.zip');
      }
    } catch (error) {
      console.error('Conversion error:', error);
      if (error instanceof Error) {
        // Manejar error específico si es necesario
      }
    } finally {
      setConverting(false);
    }
  };
  return (
    <>
      {files.length > 0 && (
        <Button
          onClick={convertFiles}
          disabled={converting}
          size="lg"
          loading={converting}
          loadingText="Converting..."
        >
          Convert & Download
        </Button>
      )}
    </>
  );
}
