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
import { GetBoxBox, GetBoxParams, GetBoxResult } from '@tinybox/jsonrpc';
import { HiCheck, HiCog, HiTrash } from 'react-icons/hi';
import { useEffect, useState } from 'react';

import { DrawerFormHeading } from './DrawerFormHeading';
import { InputGroup } from './InputGroup';
import { RootState } from '../redux/reducers';
import { rpc } from '../api';
import { useSelector } from 'react-redux';

export type BoxDrawerProps = {
  isOpen: boolean;
  boxId: string;
  onClose: () => void;
  onSaved: () => void;
};

export function BoxDrawer({ isOpen, onClose, boxId, onSaved }: BoxDrawerProps) {
  const homeId = useSelector((state: RootState) => state.home.homeId);
  const [box, setBox] = useState<GetBoxBox | null>(null);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    reloadBox();
  }, [boxId]);

  const reloadBox = async () => {
    const result: GetBoxResult = await rpc<GetBoxParams>('getBox', {
      boxId,
      homeId,
    });
    setBox(result.box);
    setName(result.box.name);
  };

  const saveBox = async () => {
    // Check to see if box is null, null case should never happen as the UI
    // is blocked until box is non-null.
    if (box) {
      setSaving(true);
      await rpc('updateBox', {
        boxId,
        homeId,
        box: {
          name: name,
          parentId: box.parentId,
        },
      });
      setSaving(false);
      onSaved();
    }
  };

  if (!box) return <Spinner />;

  return (
    <Drawer isOpen={isOpen} placement="right" size="lg" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          <HStack>
            <HiCog />
            <Text>{box.name} - Settings</Text>
          </HStack>
        </DrawerHeader>

        <DrawerBody>
          <Stack gap={4}>
            <Box>
              <DrawerFormHeading
                title={'Preference'}
                description={
                  'Common settings for the box, such as name and ID.'
                }
              />
              <Stack>
                <InputGroup
                  label={'Box Name'}
                  placeholder={'Fridge'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={saving}
                />
                <InputGroup
                  label={'Box ID'}
                  placeholder={'b_xxx'}
                  disabled={true}
                  value={box.id}
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
                  Delete Box
                </Button>
              </Stack>
            </Box>
          </Stack>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            colorScheme="pink"
            leftIcon={<HiCheck />}
            isLoading={saving}
            onClick={saveBox}
          >
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
