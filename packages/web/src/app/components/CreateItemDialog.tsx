import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Input,
  Stack,
} from '@chakra-ui/react';
import { HiCheck, HiX } from 'react-icons/hi';
import React, { useState } from 'react';

import { ErrorAlert } from './ErrorAlert';
import { rpc } from '../api';

export type LogoutDialogProps = {
  isOpen: boolean;
  boxId: string;
  onClose: () => void;
  onCreated: () => void;
  homeId: string;
};

export function CreateItemDialog({
  isOpen,
  onClose,
  onCreated,
  boxId,
  homeId,
}: LogoutDialogProps) {
  const cancelRef = React.useRef(null);
  const [errorText, setErrorText] = useState('');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);

  const createItem = async () => {
    setErrorText('');
    setLoading(true);
    try {
      await rpc('createItem', { homeId, name, boxId, quantity });
      onCreated();
      setName('');
      setQuantity(1);
    } catch (e) {
      if (e instanceof Error) {
        setErrorText(e.message);
      }
    }
    setLoading(false);
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Create Item
          </AlertDialogHeader>

          {errorText ? (
            <AlertDialogBody>
              <ErrorAlert text={errorText} onClose={() => setErrorText('')} />
            </AlertDialogBody>
          ) : null}

          <AlertDialogBody>
            <Stack gap={2}>
              <Input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                type={'number'}
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              />
            </Stack>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={onClose}
              leftIcon={<HiX />}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={createItem}
              ml={3}
              leftIcon={<HiCheck />}
              isLoading={loading}
            >
              Create
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
