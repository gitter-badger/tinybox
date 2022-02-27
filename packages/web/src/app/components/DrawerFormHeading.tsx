import { Heading, Stack, Text } from '@chakra-ui/react';

export type DrawerFormHeadingProps = {
  title: string;
  description: string;
  color?: string;
};

export function DrawerFormHeading({
  title,
  description,
  color,
}: DrawerFormHeadingProps) {
  return (
    <Stack spacing={1} mb={3} color={color}>
      <Heading fontSize={'lg'}>{title}</Heading>
      <Text fontSize="xs">{description}</Text>
    </Stack>
  );
}
