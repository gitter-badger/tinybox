import {
  Box,
  Button,
  Container,
  HStack,
  Heading,
  Input,
  Spinner,
  Stack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { Helmet } from 'react-helmet';
import { HiLogout } from 'react-icons/hi';
import { InputGroup } from '../../components/InputGroup';
import { LogoutDialog } from '../../components/LogoutDialog';
import { getPageTitle } from '../../shared/helmet';
import { rpc } from '../../api';

export function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

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
            </HStack>
          </Stack>
        ) : (
          <Spinner />
        )}
      </Box>
    </div>
  );
}
