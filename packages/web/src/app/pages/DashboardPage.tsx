import { Box, Flex, HStack, Link, Stack, Text } from '@chakra-ui/react';
import { HiAdjustments, HiArchive, HiUser } from 'react-icons/hi';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import { Copyright } from '../components/Copyright';
import { matchPath } from 'react-router-dom';

const SIDEBAR_LINKS = [
  { title: 'Boxes', to: '/dashboard/boxes', icon: <HiArchive /> },
  { title: 'Settings', to: '/dashboard/settings', icon: <HiAdjustments /> },
  { title: 'Account', to: '/dashboard/account', icon: <HiUser /> },
];

export const DashboardPage = () => {
  const location = useLocation();

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
      <Box flex={1} h="5000px" p={4}>
        Page content
      </Box>
    </Flex>
  );
};
