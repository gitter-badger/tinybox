import { Box, Button, HStack, Heading, Spinner, Stack } from '@chakra-ui/react';
import { HiLogout, HiOutlineSwitchHorizontal } from 'react-icons/hi';
import { useEffect, useState } from 'react';

import { GetCurrentUserResult } from '@tinybox/jsonrpc';
import { Helmet } from 'react-helmet';
import { InputGroup } from '../../components/InputGroup';
import { LogoutDialog } from '../../components/LogoutDialog';
import { getPageTitle } from '../../shared/helmet';
import { rpc } from '../../api';
import { setHomeId } from '../../redux/actions';
import { useDispatch } from 'react-redux';

export function AccountPage() {
  const [user, setUser] = useState<GetCurrentUserResult | null>(null);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    reloadCurrentUser();
  }, []);

  const reloadCurrentUser = async () => {
    const resp = await rpc('getCurrentUser', {});
    setUser(resp);
  };

  return (
    <div>
      <Helmet>
        <title>{getPageTitle('Account')}</title>
      </Helmet>
      <Heading>Account</Heading>
      <Box maxW="4xl" mt={4}>
        {user ? (
          <Stack spacing={4}>
            <InputGroup
              label="Name"
              placeholder="Your name"
              disabled={true}
              value={user.name}
            />
            <InputGroup
              label="Email Address"
              placeholder="example@example.com"
              disabled={true}
              value={user.email}
            />
            <HStack>
              <Button
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
              <Button
                colorScheme={'pink'}
                leftIcon={<HiOutlineSwitchHorizontal />}
                onClick={() => {
                  window.localStorage.removeItem('homeId');
                  dispatch(setHomeId(null));
                }}
              >
                Switch Home
              </Button>
            </HStack>
          </Stack>
        ) : (
          <Spinner />
        )}
      </Box>
    </div>
  );
}
