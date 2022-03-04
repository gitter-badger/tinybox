import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { HiCheck, HiTrash } from 'react-icons/hi';
import { useEffect, useState } from 'react';

import { BiCubeAlt } from 'react-icons/bi';
import { DeleteItemDialog } from './DeleteItemDialog';
import { DrawerFormHeading } from './DrawerFormHeading';
import { ErrorAlert } from './ErrorAlert';
import { GetItemItem } from '@tinybox/jsonrpc';
import { InputGroup } from './InputGroup';
import { rpc } from '../api';

export type ItemDrawerProps = {
  isOpen: boolean;
  boxId: string;
  itemId: string;
  homeId: string;
  onSaved: () => void;
  onClose: () => void;
};

export function ItemDrawer({
  isOpen,
  onClose,
  boxId,
  itemId,
  onSaved,
  homeId,
}: ItemDrawerProps) {
  const [item, setItem] = useState<GetItemItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [errorText, setErrorText] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (homeId && boxId && itemId) {
      setErrorText('');
      setItem(null);
      reloadItem();
    }
  }, [homeId, boxId, itemId]);

  const reloadItem = async () => {
    try {
      const result = await rpc('getItem', { homeId, boxId, itemId });
      setItem(result.item);
      setName(result.item.name);
      setQuantity(result.item.quantity);
    } catch (e) {
      if (e instanceof Error) {
        setErrorText(e.message);
      }
    }
  };

  const saveItem = async () => {
    // This function should only do something if item is already loaded,
    // item should never be null as UI is blocked if item is null.
    if (item) {
      setSaving(true);
      try {
        await rpc('updateItem', {
          homeId,
          boxId,
          itemId,
          item: {
            name: name,
            quantity: quantity,
            boxId: item.boxId,
          },
        });
        onSaved();
      } catch (e) {
        if (e instanceof Error) {
          setErrorText(e.message);
        }
      }
      setSaving(false);
    }
  };

  return (
    <Drawer isOpen={isOpen} placement="right" size="lg" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          <HStack>
            <BiCubeAlt />
            {item ? <Text>{item.name}</Text> : <Spinner />}
          </HStack>
        </DrawerHeader>
        <DrawerBody>
          {errorText && (
            <Box mb={4}>
              <ErrorAlert text={errorText} onClose={() => setErrorText('')} />
            </Box>
          )}
          {item ? (
            <Stack gap={4}>
              <Box>
                <DrawerFormHeading
                  title={'Preference'}
                  description={
                    'Common settings for the item, such as name and ID.'
                  }
                />
                <Stack>
                  <InputGroup
                    label={'Item ID'}
                    placeholder={'b_xxx'}
                    disabled={true}
                    value={item.id}
                  />
                  <InputGroup
                    label={'Item Name'}
                    placeholder={'Juice'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={saving}
                  />
                  <InputGroup
                    label={'Item Quantity'}
                    placeholder={'1'}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    disabled={saving}
                  />
                </Stack>
              </Box>
              <Box>
                <DrawerFormHeading
                  title={'Danger Zone'}
                  description={
                    'Dangerous actions, most actions taken here cannot be undone, please be careful before proceeding.'
                  }
                  color={'red.500'}
                />
                <Stack>
                  <Button
                    colorScheme={'red'}
                    leftIcon={<HiTrash />}
                    disabled={saving}
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    Delete Item
                  </Button>
                  <DeleteItemDialog
                    item={item}
                    homeId={homeId}
                    isOpen={isDeleteDialogOpen}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onDeleted={() => {
                      setIsDeleteDialogOpen(false);
                      onSaved();
                    }}
                  />
                </Stack>
              </Box>
            </Stack>
          ) : (
            <Spinner />
          )}
        </DrawerBody>

        <DrawerFooter>
          {item ? (
            <>
              <Button
                variant="outline"
                mr={3}
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                colorScheme="pink"
                leftIcon={<HiCheck />}
                isLoading={saving}
                onClick={saveItem}
              >
                Save
              </Button>
            </>
          ) : (
            <Spinner />
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
