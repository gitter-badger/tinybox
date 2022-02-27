import { Input, Stack, Text } from '@chakra-ui/react';

export type InputGroupProps = {
  label: string;
  placeholder: string;
  disabled?: boolean;
  value?: string;
  onChange?: any;
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
