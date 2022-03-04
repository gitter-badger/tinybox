import { Box, Button, HStack, Heading, Spinner, Stack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { GetHomeHome } from '@tinybox/jsonrpc';
import { Helmet } from 'react-helmet';
import { HiSave } from 'react-icons/hi';
import { InputGroup } from '../../components/InputGroup';
import { RootState } from '../../redux/reducers';
import { getPageTitle } from '../../shared/helmet';
import { rpc } from '../../api';
import { useSelector } from 'react-redux';

export const SettingsPage = () => {
  const [home, setHome] = useState<GetHomeHome | null>(null);
  const homeId = useSelector((state: RootState) => state.home.homeId);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');

  const reloadHome = async () => {
    const resp = await rpc('getHome', { id: homeId });
    setHome(resp.home);
    setName(resp.home.name);
  };

  const saveHome = async () => {
    setSaving(true);
    await rpc('updateHome', { id: homeId, name });
    setSaving(false);
  };

  useEffect(() => {
    reloadHome();
  }, []);

  return (
    <div>
      <Helmet>
        <title>{getPageTitle('Settings')}</title>
      </Helmet>
      <Heading>Settings</Heading>
      <Box maxW="4xl" mt={4}>
        {home ? (
          <Stack spacing={4}>
            <InputGroup
              label="Home ID"
              placeholder="h_xxx"
              disabled={true}
              value={home.id}
            />
            <InputGroup
              label="Name"
              placeholder="h_xxx"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={saving}
            />
            <HStack>
              <Button
                colorScheme={'pink'}
                leftIcon={<HiSave />}
                isLoading={saving}
                onClick={saveHome}
              >
                Save
              </Button>
            </HStack>
          </Stack>
        ) : (
          <Spinner />
        )}
      </Box>
    </div>
  );
};
