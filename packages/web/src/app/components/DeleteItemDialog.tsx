import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import { HiTrash, HiX } from 'react-icons/hi';
import React, { useState } from 'react';

import { ErrorAlert } from './ErrorAlert';
import { GetItemItem } from '@tinybox/jsonrpc';
import { rpc } from '../api';

export type DeleteItemDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => void;
  item: GetItemItem;
  homeId: string;
};

export function DeleteItemDialog({
  isOpen,
  onClose,
  item,
  onDeleted,
  homeId,
}: DeleteItemDialogProps) {
  const cancelRef = React.useRef(null);
  const [errorText, setErrorText] = useState('');
  const [loading, setLoading] = useState(false);

  const deleteItem = async () => {
    setErrorText('');
    setLoading(true);
    try {
      await rpc('deleteItem', { homeId, boxId: item.boxId, itemId: item.id });
      onDeleted();
    } catch (e) {
      if (e instanceof Error) {
        setErrorText(e.message);
      }
    }
    setLoading(false);
  };

  if (!item) return null;

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete {item.name}
          </AlertDialogHeader>

          {errorText ? (
            <AlertDialogBody>
              <ErrorAlert text={errorText} onClose={() => setErrorText('')} />
            </AlertDialogBody>
          ) : null}

          <AlertDialogBody>
            Are you sure you want to delete this item? This action cannot be
            undone.
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
              onClick={deleteItem}
              ml={3}
              leftIcon={<HiTrash />}
              isLoading={loading}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
