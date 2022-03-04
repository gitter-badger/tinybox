import { Box, Flex, HStack, Stack, Text } from '@chakra-ui/react';
import { HiAdjustments, HiArchive, HiUser } from 'react-icons/hi';
import {
  Route,
  Link as RouterLink,
  Switch,
  useHistory,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';

import { AccountPage } from './dashboard/AccountPage';
import { BoxesPage } from './dashboard/BoxesPage';
import { RootState } from '../redux/reducers';
import { SettingsPage } from './dashboard/SettingsPage';
import { matchPath } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export const DashboardPage = () => {
  const authenticated = useSelector(
    (state: RootState) => state.auth.authenticated
  );
  const history = useHistory();
  const location = useLocation();
  const { path, url } = useRouteMatch();

  const SIDEBAR_LINKS = [
    { title: 'Boxes', to: `${url}/boxes`, icon: <HiArchive /> },
    { title: 'Settings', to: `${url}/settings`, icon: <HiAdjustments /> },
    { title: 'Account', to: `${url}/account`, icon: <HiUser /> },
  ];

  useEffect(() => {
    if (!authenticated) {
      history.push('/login');
    }
  }, [authenticated, history]);

  return (
    <Flex>
      <Box w="200px">
        <Box sx={{ position: 'sticky', top: '0px' }} p={4}>
          <Stack spacing={2}>
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
          </Stack>
        </Box>
      </Box>
      <Box flex={1} p={4}>
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
