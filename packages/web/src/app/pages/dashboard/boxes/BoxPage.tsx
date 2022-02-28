import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  HStack,
  Heading,
  Spinner,
  Stack,
} from '@chakra-ui/react';
import { HiChevronRight, HiCog, HiPlus } from 'react-icons/hi';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { BoxCard } from '../../../components/BoxCard';
import { BoxDrawer } from '../../../components/BoxDrawer';
import { CreateBoxDialog } from '../../../components/CreateBoxDialog';
import { CreateItemDialog } from '../../../components/CreateItemDialog';
import { Helmet } from 'react-helmet';
import { ItemCard } from '../../../components/ItemCard';
import { ItemDrawer } from '../../../components/ItemDrawer';
import { NoItemBadge } from '../../../components/NoItemBadge';
import { getParents } from '../../../shared/boxHelpers';
import { rpc } from '../../../api';
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
  const [parentBoxes, setParentBoxes] = useState<any[]>([]);
  const [isBoxDrawerOpen, setIsBoxDrawerOpen] = useState(false);
  const [isItemDrawerOpen, setIsItemDrawerOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState('');

  useEffect(() => {
    setBox(null);
    setChildBoxes([]);

    reloadBoxInfo();
    reloadParentsInfo();
    reloadChildBoxes();
    reloadItems();
  }, [boxId]);

  const reloadBoxInfo = async () => {
    const result = await rpc('getBox', { boxId, homeId });
    setBox(result.box);
  };

  const reloadParentsInfo = async () => {
    const parentIds = await getParents(homeId, boxId);
    const parents = [];
    for (const parentId of parentIds) {
      const result = await rpc('getBox', { homeId, boxId: parentId });
      parents.push(result.box);
    }
    setParentBoxes(parents);
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
      <Helmet>
        <title>{box ? box.name : 'Loading'} - Tinybox</title>
      </Helmet>
      <Heading>{box ? box.name : <Spinner />}</Heading>
      <Breadcrumb
        fontWeight="medium"
        fontSize="sm"
        separator={<HiChevronRight />}
      >
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to={`/dashboard/boxes`}>
            Boxes
          </BreadcrumbLink>
        </BreadcrumbItem>
        {parentBoxes.map((box) => {
          return (
            <BreadcrumbItem key={box.id}>
              <BreadcrumbLink as={Link} to={`/dashboard/boxes/${box.id}`}>
                {box.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          );
        })}
      </Breadcrumb>

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
          <Button
            leftIcon={<HiCog />}
            variant={'ghost'}
            onClick={() => setIsBoxDrawerOpen(true)}
          >
            Box Settings
          </Button>
          <BoxDrawer
            isOpen={isBoxDrawerOpen}
            boxId={boxId}
            onClose={() => setIsBoxDrawerOpen(false)}
            onSaved={() => {
              setIsBoxDrawerOpen(false);
              reloadBoxInfo();
            }}
          />
        </HStack>
      </Box>
      <Box>
        <Heading fontSize={'2xl'}>Items</Heading>
        {items.length === 0 && (
          <Box mt={4}>
            <NoItemBadge text="Nothing in this box." />
          </Box>
        )}
        <Flex mt={4} gap={4} flexWrap={'wrap'}>
          {items.map((item) => {
            return (
              <ItemCard
                key={item.id}
                item={item}
                onClick={() => {
                  setIsItemDrawerOpen(true);
                  setSelectedItemId(item.id);
                }}
              />
            );
          })}
        </Flex>
        <ItemDrawer
          isOpen={isItemDrawerOpen}
          onClose={() => {
            setIsItemDrawerOpen(false);
          }}
          itemId={selectedItemId}
          boxId={boxId}
        />
      </Box>
      <Box>
        <Heading fontSize={'2xl'}>Boxes</Heading>
        {childBoxes.length === 0 && (
          <Box mt={4}>
            <NoItemBadge text="No child box in this box." />
          </Box>
        )}
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
