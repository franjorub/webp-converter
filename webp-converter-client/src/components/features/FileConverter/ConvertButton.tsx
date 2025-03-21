import { useFileStore } from '@/store';
import { Button } from '@chakra-ui/react';
import { useState } from 'react';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { useWebpConverter } from '@/api/webpConverter.ts';
import { toaster } from '@/components/ui/toaster.tsx';

export default function ConvertButton() {
  const files = useFileStore(state => state.files);
  const updateFileProgress = useFileStore(state => state.updateFileProgress);

  const [converting, setConverting] = useState(false);

  const webpClient = useWebpConverter();

  const convertFiles = async () => {
    setConverting(true);
    const convertedFiles: Array<{ name: string; data: Blob }> = [];

    try {
      await Promise.all(
        files.map(async fileState => {
          const response = await webpClient.convertToWebp(fileState.file, {
            onUploadProgress: progressEvent => {
              updateFileProgress(fileState.id, (progressEvent.progress ?? 0) * 100);
            },
          });

          convertedFiles.push({
            name: fileState.file.name.replace(/\.jpe?g$/, '.webp'),
            data: response as Blob,
          });
        })
      );

      toaster.create({
        description: 'Conversion completed',
        type: 'success',
      });

      if (convertedFiles.length === 1) {
        const file = convertedFiles[0];
        saveAs(file.data, file.name);
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
        toaster.create({
          description: error.message,
          type: 'error',
        });
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
