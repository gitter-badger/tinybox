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
import { HiCheck, HiCog, HiTrash } from 'react-icons/hi';
import { useEffect, useState } from 'react';

import { BiCubeAlt } from 'react-icons/bi';
import { DrawerFormHeading } from './DrawerFormHeading';
import { InputGroup } from './InputGroup';
import { rpc } from '../api';
import { useSelector } from 'react-redux';

export type ItemDrawerProps = {
  isOpen: boolean;
  boxId: string;
  itemId: string;
  onClose: () => void;
};

export function ItemDrawer({
  isOpen,
  onClose,
  boxId,
  itemId,
}: ItemDrawerProps) {
  const homeId = useSelector((state: any) => state.home.homeId);
  const [item, setItem] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');

  const saveItem = () => {
    return null;
  };

  useEffect(() => {
    if (homeId && boxId && itemId) {
      setItem(null);
      reloadItem();
    }
  }, [homeId, boxId, itemId]);

  const reloadItem = async () => {
    const result = await rpc('getItem', { homeId, boxId, itemId });
    setItem(result.item);
    setName(result.item.name);
    setQuantity(result.item.quantity);
  };

  return (
    <Drawer isOpen={isOpen} placement="right" size="lg" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        {item ? (
          <>
            <DrawerCloseButton />
            <DrawerHeader>
              <HStack>
                <BiCubeAlt />
                <Text>{item.name}</Text>
              </HStack>
            </DrawerHeader>
            <DrawerBody>
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
                      onChange={(e: any) => setName(e.target.value)}
                      disabled={saving}
                    />
                    <InputGroup
                      label={'Item Quantity'}
                      placeholder={'1'}
                      value={quantity}
                      onChange={(e: any) => setQuantity(e.target.value)}
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
                    >
                      Delete Item
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </DrawerBody>

            <DrawerFooter>
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
            </DrawerFooter>
          </>
        ) : (
          <Spinner />
        )}
      </DrawerContent>
    </Drawer>
  );
}
