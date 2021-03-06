import { Box, Flex, Stack, Text } from '@chakra-ui/react';

import { BiCubeAlt } from 'react-icons/bi';
import { HiArchive } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { ListItemsItem } from '@tinybox/jsonrpc';

export type ItemCardProps = {
  item: ListItemsItem;
  onClick: () => void;
};

export function ItemCard({ item, onClick }: ItemCardProps) {
  return (
    <Box
      onClick={onClick}
      display={'inline-block'}
      borderWidth={2}
      width={{ base: '100%', sm: '300px' }}
      maxWidth={'100%'}
      p={6}
      borderRadius={'lg'}
      key={item.id}
      className="cursor-pointer hover:bg-gray-100 active:bg-gray-200"
    >
      <Flex align={'top'} gap={2}>
        <Text fontSize={'2xl'} textColor={'gray.500'}>
          <BiCubeAlt />
        </Text>
        <Stack spacing={0}>
          <Text fontSize={'md'} isTruncated fontWeight={'medium'}>
            {item.name}
          </Text>
          <Text fontSize={'xs'} color={'gray.500'}>
            Quantity: {item.quantity}
          </Text>
        </Stack>
      </Flex>
    </Box>
  );
}
