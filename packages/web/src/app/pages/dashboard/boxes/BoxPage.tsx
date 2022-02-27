import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Spinner,
  Stack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { BoxCard } from '../../../components/BoxCard';
import { CreateBoxDialog } from '../../../components/CreateBoxDialog';
import { CreateItemDialog } from '../../../components/CreateItemDialog';
import { HiPlus } from 'react-icons/hi';
import { ItemCard } from '../../../components/ItemCard';
import { rpc } from '../../../api';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

type BoxPageParams = {
  boxId: string;
};

export function BoxPage() {
  const homeId = useSelector((state: any) => state.home.homeId);
  const { boxId } = useParams<BoxPageParams>();
  const [box, setBox] = useState<any>(null);
  const [childBoxes, setChildBoxes] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [isCreateBoxDialogOpen, setIsCreateBoxDialogOpen] = useState(false);
  const [isCreateItemDialogOpen, setIsCreateItemDialogOpen] = useState(false);

  useEffect(() => {
    setBox(null);
    setChildBoxes([]);

    reloadBoxInfo();
    reloadChildBoxes();
    reloadItems();
  }, [boxId]);

  const reloadBoxInfo = async () => {
    const result = await rpc('getBox', { boxId, homeId });
    setBox(result.box);
  };

  const reloadChildBoxes = async () => {
    const result = await rpc('listBoxes', { homeId, parentId: boxId });
    setChildBoxes(result.boxes);
  };

  const reloadItems = async () => {
    const result = await rpc('listItems', { homeId, boxId });
    setItems(result.items);
  };

  return (
    <Stack spacing={4}>
      <Heading>{box ? box.name : <Spinner />}</Heading>
      <Box>
        <HStack spacing={2}>
          <Button
            onClick={() => setIsCreateBoxDialogOpen(true)}
            colorScheme={'pink'}
            leftIcon={<HiPlus />}
          >
            Create Box
          </Button>
          <CreateBoxDialog
            isOpen={isCreateBoxDialogOpen}
            onClose={() => setIsCreateBoxDialogOpen(false)}
            parentId={boxId}
            onCreated={() => {
              setIsCreateBoxDialogOpen(false);
              reloadChildBoxes();
            }}
          />
          <Button
            onClick={() => setIsCreateItemDialogOpen(true)}
            colorScheme={'pink'}
            leftIcon={<HiPlus />}
          >
            Create Item
          </Button>
          <CreateItemDialog
            isOpen={isCreateItemDialogOpen}
            boxId={boxId}
            onClose={() => setIsCreateItemDialogOpen(false)}
            onCreated={() => {
              setIsCreateItemDialogOpen(false);
              reloadItems();
            }}
          />
        </HStack>
      </Box>
      <Box>
        <Heading fontSize={'2xl'}>Items</Heading>
        <Flex mt={4} gap={4} flexWrap={'wrap'}>
          {items.map((item) => {
            return (
              <ItemCard
                key={item.id}
                item={item}
                to={`/dashboard/boxes/${boxId}/items/${item.id}`}
              />
            );
          })}
        </Flex>
      </Box>
      <Box>
        <Heading fontSize={'2xl'}>Boxes</Heading>
        <Flex mt={4} gap={4} flexWrap={'wrap'}>
          {childBoxes.map((box) => {
            return (
              <BoxCard
                key={box.id}
                box={box}
                to={`/dashboard/boxes/${box.id}`}
              />
            );
          })}
        </Flex>
      </Box>
    </Stack>
  );
}
