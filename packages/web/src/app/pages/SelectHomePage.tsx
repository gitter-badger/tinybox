import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Spacer,
  Stack,
  Text,
} from '@chakra-ui/react';
import { HiCheck, HiLogout, HiPlus, HiX } from 'react-icons/hi';
import {
  ListHomesHome,
  ListHomesParams,
  ListHomesResult,
} from '@tinybox/jsonrpc';
import { useEffect, useState } from 'react';

import { AuthLayout } from '../layouts/AuthLayout';
import { Copyright } from '../components/Copyright';
import { ErrorAlert } from '../components/ErrorAlert';
import { Helmet } from 'react-helmet';
import { LogoutDialog } from '../components/LogoutDialog';
import { RootState } from '../redux/reducers';
import { getPageTitle } from '../shared/helmet';
import { rpc } from '../api';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const SelectHomePage = () => {
  const authenticated = useSelector(
    (state: RootState) => state.auth.authenticated
  );
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [name, setName] = useState('');
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const history = useHistory();

  const [homes, setHomes] = useState<ListHomesHome[]>([]);

  useEffect(() => {
    if (!authenticated) {
      history.push('/login');
    } else {
      reloadHomeList();
    }
  }, [authenticated, history]);

  const reloadHomeList = async () => {
    try {
      const data: ListHomesResult = await rpc<ListHomesParams>('listHomes', {});
      setHomes(data.homes);
    } catch (e) {
      if (e instanceof Error) {
        setErrorText(e.message);
      }
    }
  };

  const selectHome = async (homeId: string) => {
    history.push(`/dashboard/${homeId}`);
  };

  const createHome = async () => {
    setErrorText('');
    setLoading(true);
    try {
      await rpc('createHome', { name });
      await reloadHomeList();
    } catch (e) {
      if (e instanceof Error) {
        setErrorText(e.message);
      }
    }
    setName('');
    setLoading(false);
    setShowCreateForm(false);
  };

  return (
    <AuthLayout>
      <Helmet>
        <title>{getPageTitle('Select Home')}</title>
      </Helmet>
      <Stack spacing={4}>
        <Heading as="h1" size="xl">
          Select Home
        </Heading>
        <Text fontSize="sm">
          Before we can proceed, select a home or create a new one.
        </Text>
        {errorText && (
          <ErrorAlert text={errorText} onClose={() => setErrorText('')} />
        )}
        <Stack>
          {homes.map((home) => (
            <Box borderWidth="1px" borderRadius="md" p={4} key={home.id}>
              <Flex align={'center'}>
                <Text>{home.name}</Text>
                <Spacer />
                <Button
                  size="sm"
                  disabled={loading}
                  onClick={() => selectHome(home.id)}
                >
                  Select
                </Button>
              </Flex>
            </Box>
          ))}
        </Stack>
        {!showCreateForm ? (
          <Button
            colorScheme="pink"
            onClick={() => setShowCreateForm(true)}
            leftIcon={<HiPlus />}
            disabled={loading}
          >
            Create New Home
          </Button>
        ) : null}
        {showCreateForm ? (
          <Stack spacing={4}>
            <Input
              placeholder="Home Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button
              colorScheme="pink"
              leftIcon={<HiCheck />}
              onClick={createHome}
              isLoading={loading}
            >
              Create
            </Button>
            <Button
              leftIcon={<HiX />}
              colorScheme="pink"
              variant={'link'}
              onClick={() => setShowCreateForm(false)}
              disabled={loading}
            >
              Cancel
            </Button>
          </Stack>
        ) : null}
        <Button
          variant="link"
          colorScheme={'pink'}
          leftIcon={<HiLogout />}
          onClick={() => setIsLogoutDialogOpen(true)}
        >
          Logout
        </Button>
        <LogoutDialog
          isOpen={isLogoutDialogOpen}
          onClose={() => setIsLogoutDialogOpen(false)}
        />
      </Stack>
      <div className="pt-6 mt-6 border-t">
        <Copyright />
      </div>
    </AuthLayout>
  );
};
