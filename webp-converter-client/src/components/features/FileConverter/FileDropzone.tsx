import { Box, FileUpload, Icon } from '@chakra-ui/react';
import { LuUpload } from 'react-icons/lu';

import { useFileStore } from '@/store';

export default function FileDropzone() {
  const addFiles = useFileStore(state => state.addFiles);

  return (
    <FileUpload.Root
      maxW="xl"
      alignItems="stretch"
      accept={{
        'image/jpeg': ['.jpg', '.jpeg'],
      }}
      onFileAccept={details => {
        addFiles(details.files);
      }}
      maxFileSize={5 * 1024 * 1024}
      maxFiles={100}
    >
      <FileUpload.HiddenInput />
      <FileUpload.Dropzone>
        <Icon size="md" color="fg.muted">
          <LuUpload />
        </Icon>
        <FileUpload.DropzoneContent>
          <Box>Drag and drop files here</Box>
          <Box color="fg.muted">.jpg, .jpeg up to 5MB</Box>
        </FileUpload.DropzoneContent>
      </FileUpload.Dropzone>
    </FileUpload.Root>
  );
}
