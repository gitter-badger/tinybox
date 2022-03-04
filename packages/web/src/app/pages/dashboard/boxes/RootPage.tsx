import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { HiArchive, HiPlus } from 'react-icons/hi';
import { Link, useParams, useRouteMatch } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { BoxCard } from '../../../components/BoxCard';
import { CreateBoxDialog } from '../../../components/CreateBoxDialog';
import { Helmet } from 'react-helmet';
import { ListBoxesBox } from '@tinybox/jsonrpc';
import { RootState } from '../../../redux/reducers';
import { getPageTitle } from '../../../shared/helmet';
import { rpc } from '../../../api';
import { useSelector } from 'react-redux';

type RootPageParams = {
  homeId: string;
};

export function RootPage() {
  const { homeId } = useParams<RootPageParams>();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [boxes, setBoxes] = useState<ListBoxesBox[]>([]);
  const { url } = useRouteMatch();

  useEffect(() => {
    reloadBoxes();
  }, [homeId]);

  const reloadBoxes = async () => {
    const response = await rpc('listBoxes', { homeId });
    setBoxes(response.boxes);
  };

  return (
    <div>
      <Helmet>
        <title>{getPageTitle('All Boxes')}</title>
      </Helmet>
      <Heading>Boxes</Heading>
      <Text fontSize={'sm'} mt={2}>
        Boxes are containers where you can store items, all items must reside
        within a box, choose or create one to start.
      </Text>
      <Box mt={4}>
        <Button
          colorScheme={'pink'}
          onClick={() => setIsCreateDialogOpen(true)}
          leftIcon={<HiPlus />}
        >
          Create Box
        </Button>
        <CreateBoxDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          homeId={homeId}
          onCreated={() => {
            setIsCreateDialogOpen(false);
            reloadBoxes();
          }}
        />
      </Box>
      <Flex mt={4} gap={4} flexWrap={'wrap'}>
        {boxes.map((box) => {
          return <BoxCard key={box.id} box={box} to={`${url}/${box.id}`} />;
        })}
      </Flex>
    </div>
  );
}
