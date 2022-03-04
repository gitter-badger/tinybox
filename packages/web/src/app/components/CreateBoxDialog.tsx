import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Input,
  Spinner,
} from '@chakra-ui/react';
import { CreateBoxParams, GetBoxBox } from '@tinybox/jsonrpc';
import { HiCheck, HiX } from 'react-icons/hi';
import React, { useEffect, useState } from 'react';

import { ErrorAlert } from './ErrorAlert';
import { RootState } from '../redux/reducers';
import { rpc } from '../api';
import { useSelector } from 'react-redux';

export type LogoutDialogProps = {
  isOpen: boolean;
  parentId?: string;
  onClose: () => void;
  onCreated: () => void;
};

export function CreateBoxDialog({
  isOpen,
  parentId,
  onClose,
  onCreated,
}: LogoutDialogProps) {
  const cancelRef = React.useRef(null);
  const [errorText, setErrorText] = useState('');
  const [loading, setLoading] = useState(false);
  const homeId = useSelector((state: RootState) => state.home.homeId);
  const [name, setName] = useState('');
  const [loadingParentInfo, setLoadingParentInfo] = useState(false);
  const [parentBox, setParentBox] = useState<GetBoxBox | null>(null);

  const createBox = async () => {
    setErrorText('');
    setLoading(true);
    try {
      await rpc<CreateBoxParams>('createBox', { homeId, parentId, name });
      onCreated();
      setName('');
    } catch (e) {
      if (e instanceof Error) {
        setErrorText(e.message);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (parentId) {
      reloadParentInfo();
    }
  }, [parentId]);

  const reloadParentInfo = async () => {
    setLoadingParentInfo(true);
    const result = await rpc('getBox', { boxId: parentId, homeId });
    setParentBox(result.box);
    setLoadingParentInfo(false);
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          {parentId ? (
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Create Box in{' '}
              {parentBox ? parentBox.name : <Spinner ml={2} size={'sm'} />}
            </AlertDialogHeader>
          ) : (
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Create Box
            </AlertDialogHeader>
          )}

          {errorText ? (
            <AlertDialogBody>
              <ErrorAlert text={errorText} onClose={() => setErrorText('')} />
            </AlertDialogBody>
          ) : null}

          <AlertDialogBody>
            <Input
              placeholder="Name"
              disabled={loadingParentInfo}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={onClose}
              leftIcon={<HiX />}
              disabled={loading || loadingParentInfo}
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={createBox}
              ml={3}
              leftIcon={<HiCheck />}
              isLoading={loading}
              disabled={loadingParentInfo}
            >
              Create
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
