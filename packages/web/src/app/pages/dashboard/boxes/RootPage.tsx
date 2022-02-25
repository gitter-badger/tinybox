import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { HiArchive, HiPlus } from 'react-icons/hi';
import { Link, useRouteMatch } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { CreateBoxDialog } from '../../../components/CreateBoxDialog';
import { Helmet } from 'react-helmet';
import { getPageTitle } from '../../../shared/helmet';
import { rpc } from '../../../api';
import { useSelector } from 'react-redux';

export function RootPage() {
  const homeId = useSelector((state: any) => state.home.homeId);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [boxes, setBoxes] = useState<any[]>([]);
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
          onCreated={() => {
            setIsCreateDialogOpen(false);
            reloadBoxes();
          }}
        />
      </Box>
      <Flex mt={4} gap={4} flexWrap={'wrap'}>
        {boxes.map((box) => {
          return (
            <Box
              as={Link}
              to={`${url}/${box.id}`}
              display={'inline-block'}
              borderWidth={2}
              width={'300px'}
              maxWidth={'100%'}
              p={6}
              borderRadius={'lg'}
              key={box.id}
              className="cursor-pointer hover:bg-gray-100 active:bg-gray-200"
            >
              <Flex align={'center'} gap={2}>
                <Text fontSize={'2xl'} textColor={'gray.500'}>
                  <HiArchive />
                </Text>
                <Text fontSize={'md'} isTruncated fontWeight={'medium'}>
                  {box.name}
                </Text>
              </Flex>
            </Box>
          );
        })}
      </Flex>
    </div>
  );
}
