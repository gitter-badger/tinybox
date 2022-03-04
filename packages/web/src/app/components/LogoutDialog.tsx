import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import { HiLogout, HiX } from 'react-icons/hi';
import React, { useState } from 'react';

import { ErrorAlert } from './ErrorAlert';
import { logout as logoutAction } from '../redux/actions';
import { rpc } from '../api';
import { useDispatch } from 'react-redux';

export type LogoutDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function LogoutDialog({ isOpen, onClose }: LogoutDialogProps) {
  const cancelRef = React.useRef(null);
  const [errorText, setErrorText] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const logout = async () => {
    setErrorText('');
    setLoading(true);
    try {
      await rpc('logout', {});
      window.localStorage.removeItem('homeId');
      dispatch(logoutAction());
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
            Logout
          </AlertDialogHeader>

          {errorText ? (
            <AlertDialogBody>
              <ErrorAlert text={errorText} onClose={() => setErrorText('')} />
            </AlertDialogBody>
          ) : null}

          <AlertDialogBody>
            Are you sure you want to logout of your account?
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
              onClick={logout}
              ml={3}
              leftIcon={<HiLogout />}
              isLoading={loading}
            >
              Yes, log me out!
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
