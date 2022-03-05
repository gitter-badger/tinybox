import {
  Box,
  Button,
  Flex,
  HStack,
  ScaleFade,
  Stack,
  Text,
} from '@chakra-ui/react';
import { HiAdjustments, HiArchive, HiMenu, HiUser, HiX } from 'react-icons/hi';
import {
  Route,
  Link as RouterLink,
  Switch,
  useHistory,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';
import { useEffect, useState } from 'react';

import { AccountPage } from './dashboard/AccountPage';
import { BoxesPage } from './dashboard/BoxesPage';
import { RootState } from '../redux/reducers';
import { SettingsPage } from './dashboard/SettingsPage';
import { matchPath } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const DashboardPage = () => {
  const authenticated = useSelector(
    (state: RootState) => state.auth.authenticated
  );
  const history = useHistory();
  const { path } = useRouteMatch();
  const [showNavigation, setShowNavigation] = useState(false);

  useEffect(() => {
    if (!authenticated) {
      history.push('/login');
    }
  }, [authenticated, history]);

  return (
    <Flex flexDirection={{ base: 'column', sm: 'row' }}>
      <Box
        w={{ base: '100%', sm: '200px' }}
        display={{ base: 'block', sm: 'block' }}
      >
        <Box
          sx={{ position: 'sticky', top: '0px' }}
          p={4}
          pb={{ base: 0, sm: 4 }}
        >
          <Stack spacing={2} mt={2}>
            <HStack
              justify={'center'}
              justifyContent={{ base: 'space-between', sm: 'center' }}
              mb={4}
            >
              <img src="/assets/logo.png" width="50" alt="Tinybox" />
              <Button
                display={{ base: 'flex', sm: 'none' }}
                variant={'ghost'}
                onClick={() => setShowNavigation(!showNavigation)}
                leftIcon={showNavigation ? <HiX /> : <HiMenu />}
              >
                Menu
              </Button>
            </HStack>
            <Box display={{ base: 'block', sm: 'none' }}>
              <Box display={showNavigation ? 'block' : 'none'} pb={4}>
                <ScaleFade in={showNavigation}>
                  <SideBarItems />
                </ScaleFade>
              </Box>
            </Box>
            <Box display={{ base: 'none', sm: 'block' }}>
              <SideBarItems />
            </Box>
          </Stack>
        </Box>
      </Box>
      <Box flex={1} p={4} pt={{ base: 0, sm: 4 }}>
        <Switch>
          <Route path={`${path}/boxes`}>
            <BoxesPage />
          </Route>
          <Route path={`${path}/settings`}>
            <SettingsPage />
          </Route>
          <Route path={`${path}/account`}>
            <AccountPage />
          </Route>
          <Route path={`${path}*`}>
            <DefaultRoute />
          </Route>
        </Switch>
      </Box>
    </Flex>
  );
};

function DefaultRoute() {
  const history = useHistory();
  const { url } = useRouteMatch();
  useEffect(() => {
    history.push(`${url}/boxes`);
  }, []);

  return null;
}

function SideBarItems() {
  const location = useLocation();
  const { url } = useRouteMatch();
  const SIDEBAR_LINKS = [
    { title: 'Boxes', to: `${url}/boxes`, icon: <HiArchive /> },
    { title: 'Settings', to: `${url}/settings`, icon: <HiAdjustments /> },
    { title: 'Account', to: `${url}/account`, icon: <HiUser /> },
  ];

  return (
    <>
      {SIDEBAR_LINKS.map((link) => {
        const match = matchPath(location.pathname, {
          path: link.to,
        });
        return (
          <Box
            key={link.title}
            bgColor={match ? 'pink.50' : 'transparent'}
            as={RouterLink}
            to={link.to}
            px={4}
            py={2}
            borderRadius={'lg'}
            display={'block'}
          >
            <Box
              fontSize="sm"
              color={match ? 'pink.700' : 'gray.700'}
              fontWeight={match ? 'bold' : 'medium'}
            >
              <HStack>
                {link.icon}
                <Text>{link.title}</Text>
              </HStack>
            </Box>
          </Box>
        );
      })}
    </>
  );
}
