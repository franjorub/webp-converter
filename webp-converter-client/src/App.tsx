import { Box, Heading, Stack } from '@chakra-ui/react';
import { Toaster } from '@/components/ui/toaster.tsx';
import { ConvertButton, FileDropzone, FileList } from '@/components/features/FileConverter';

export default function App() {
  return (
    <Box padding={8} maxW="xl" mx="auto">
      <Stack gap={4}>
        <Heading as="h1" size="4xl">
          WebP Converter
        </Heading>
        <FileDropzone />
        <FileList />
        <ConvertButton />
      </Stack>
      <Toaster />
    </Box>
  );
}
