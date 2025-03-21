import FileDropzone from '@/components/features/FileConverter/FileDropzone.tsx';
import FileList from '@/components/features/FileConverter/FileList.tsx';
import ConvertButton from '@/components/features/FileConverter/ConvertButton.tsx';
import { Heading, Stack } from '@chakra-ui/react';
import { Toaster } from '@/components/ui/toaster.tsx';

export default function App() {
  return (
    <div>
      <Stack gap={4}>
        <Heading as="h1" size="4xl">
          WebP Converter
        </Heading>
        <FileDropzone />
        <FileList />
        <ConvertButton />
      </Stack>
      <Toaster />
    </div>
  );
}
