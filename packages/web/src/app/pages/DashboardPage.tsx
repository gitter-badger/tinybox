import { Box, Flex, HStack, Stack, Text } from '@chakra-ui/react';
import { HiAdjustments, HiArchive, HiUser } from 'react-icons/hi';
import {
  Route,
  Link as RouterLink,
  Switch,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';

import { BoxesPage } from './dashboard/BoxesPage';
import { matchPath } from 'react-router-dom';

export const DashboardPage = () => {
  const location = useLocation();
  const { path, url } = useRouteMatch();

  const SIDEBAR_LINKS = [
    { title: 'Boxes', to: `${url}/boxes`, icon: <HiArchive /> },
    { title: 'Settings', to: `${url}/settings`, icon: <HiAdjustments /> },
    { title: 'Account', to: `${url}/account`, icon: <HiUser /> },
  ];

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
          <Route path={`${path}/settings`}>Settings</Route>
          <Route path={`${path}/account`}>Account</Route>
        </Switch>
      </Box>
    </Flex>
  );
};
