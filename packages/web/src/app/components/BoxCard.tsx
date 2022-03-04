import { Box, Flex, Text } from '@chakra-ui/react';

import { HiArchive } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { ListBoxesBox } from '@tinybox/jsonrpc';

export type BoxCardProps = {
  box: ListBoxesBox;
  to: string;
};

export function BoxCard({ box, to }: BoxCardProps) {
  return (
    <Box
      as={Link}
      to={to}
      display={'inline-block'}
      borderWidth={2}
      width={'300px'}
      maxWidth={'100%'}
      p={6}
      borderRadius={'lg'}
      key={box.id}
      className="cursor-pointer hover:bg-gray-100 active:bg-gray-200"
    >
      <Flex align={'center'} gap={2}>
        <Text fontSize={'2xl'} textColor={'gray.500'}>
          <HiArchive />
        </Text>
        <Text fontSize={'md'} isTruncated fontWeight={'medium'}>
          {box.name}
        </Text>
      </Flex>
    </Box>
  );
}
