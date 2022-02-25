import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Input,
  Text,
} from '@chakra-ui/react';
import { HiCheck, HiX } from 'react-icons/hi';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ErrorAlert } from './ErrorAlert';
import { logout as logoutAction } from '../redux/actions';
import { rpc } from '../api';

export type LogoutDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export function CreateBoxDialog({
  isOpen,
  onClose,
  onCreated,
}: LogoutDialogProps) {
  const cancelRef = React.useRef(null);
  const [errorText, setErrorText] = useState('');
  const [loading, setLoading] = useState(false);
  const homeId = useSelector((state: any) => state.home.homeId);
  const [name, setName] = useState('');

  const createBox = async () => {
    setErrorText('');
    setLoading(true);
    try {
      await rpc('createBox', { homeId, name });
      onCreated();
      setName('');
    } catch (e: any) {
      setErrorText(e.message);
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
            Create Box
          </AlertDialogHeader>

          {errorText ? (
            <AlertDialogBody>
              <ErrorAlert text={errorText} onClose={() => setErrorText('')} />
            </AlertDialogBody>
          ) : null}

          <AlertDialogBody>
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
              onClick={createBox}
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
