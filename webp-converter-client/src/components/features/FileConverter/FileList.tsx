import { useFileStore } from '@/store';

import { Icon, Table } from '@chakra-ui/react';
import { LuFile } from 'react-icons/lu';

const parseFileSize = (size: number) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let unitIndex = 0;
  while (size > 1024) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

export default function FileList() {
  const files = useFileStore(state => state.files);

  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>File</Table.ColumnHeader>
          <Table.ColumnHeader>Size</Table.ColumnHeader>
          <Table.ColumnHeader>Progress</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {files.map(file => (
          <Table.Row key={file.id}>
            <Table.Cell>
              <Icon size="md" color="fg.muted" marginRight="2">
                <LuFile />
              </Icon>
              {file.file.name}
            </Table.Cell>
            <Table.Cell>{parseFileSize(file.file.size)}</Table.Cell>
            <Table.Cell>{file.progress}%</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
