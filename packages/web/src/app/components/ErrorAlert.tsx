import { Alert, AlertIcon, CloseButton, Heading, Text } from '@chakra-ui/react';

export type ErrorAlertProps = {
  text: string;
  onClose: () => void;
};

export function ErrorAlert({ text, onClose }: ErrorAlertProps) {
  return (
    <Alert status="error" variant="solid">
      <AlertIcon />
      <div>
        <Heading fontSize={'sm'} fontWeight={'bold'}>
          Oops, something went wrong.
        </Heading>
        <Text fontSize={'sm'}>{text}</Text>
      </div>
      <CloseButton
        position="absolute"
        right="8px"
        top="8px"
        onClick={onClose}
      />
    </Alert>
  );
}
