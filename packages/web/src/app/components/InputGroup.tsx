import { Input, Stack, Text } from '@chakra-ui/react';

import { ChangeEvent } from 'react';

export type InputGroupProps = {
  label: string;
  placeholder: string;
  disabled?: boolean;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

export function InputGroup({
  label,
  placeholder,
  disabled,
  value,
  onChange,
}: InputGroupProps) {
  return (
    <Stack>
      <Text fontSize={'sm'} fontWeight={'medium'} color={'gray.600'}>
        {label}
      </Text>
      <Input
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={onChange}
      />
    </Stack>
  );
}
