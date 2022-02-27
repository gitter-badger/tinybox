import { Box, Text } from '@chakra-ui/react';

export type NoItemBadge = {
  text: string;
};

export function NoItemBadge({ text }: NoItemBadge) {
  return (
    <Box backgroundColor={'gray.50'} p={4}>
      <Text fontSize={'xs'} color={'gray.700'} fontWeight={'medium'}>
        {text}
      </Text>
    </Box>
  );
}
