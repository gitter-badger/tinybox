import {
  Alert,
  AlertIcon,
  Button,
  CloseButton,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { HiLogin, HiQuestionMarkCircle, HiUserAdd } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { AuthLayout } from '../layouts/AuthLayout';
import { Copyright } from '../components/Copyright';
import { Helmet } from 'react-helmet';
import { getPageTitle } from '../shared/helmet';
import { rpc } from '../api';
import { setAuthenticated } from '../redux/actions';
import { useHistory } from 'react-router-dom';

export const LoginPage = () => {
  const authenticated = useSelector((state: any) => state.auth.authenticated);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorText, setErrorText] = useState('');
  const dispatch = useDispatch();
  const history = useHistory();

  const login = () => {
    setLoading(true);
    setErrorText('');
    rpc('login', { email, password })
      .then(() => {
        // We succeed, set authenticated state
        dispatch(setAuthenticated(true));
      })
      .catch((e) => {
        setErrorText(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (authenticated) {
      history.push('/select_home');
    }
  }, [authenticated]);

  return (
    <AuthLayout>
      <Helmet>
        <title>{getPageTitle('Login')}</title>
      </Helmet>
      <div className="flex flex-col gap-4">
        <Heading as="h1" size="xl">
          Login
        </Heading>
        {errorText && (
          <Alert status="error">
            <AlertIcon />
            {errorText}
            <CloseButton
              position="absolute"
              right="8px"
              top="8px"
              onClick={() => setErrorText('')}
            />
          </Alert>
        )}
        <Input
          type="text"
          placeholder="Email"
          value={email}
          disabled={loading}
          onChange={(e: any) => setEmail(e.target.value)}
        />
        <InputGroup>
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            disabled={loading}
            onChange={(e: any) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              colorScheme="pink"
              variant="ghost"
              disabled={loading}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
        <Button
          leftIcon={<HiLogin />}
          colorScheme="pink"
          onClick={login}
          isLoading={loading}
        >
          Login
        </Button>
        <Button
          leftIcon={<HiQuestionMarkCircle />}
          colorScheme="pink"
          variant="link"
          disabled={loading}
          onClick={() => history.push('/reset_password')}
        >
          Forgot Password
        </Button>
        <Button
          leftIcon={<HiUserAdd />}
          colorScheme="pink"
          variant="link"
          disabled={loading}
          onClick={() => history.push('/create_account')}
        >
          Create Account
        </Button>
      </div>
      <div className="pt-6 mt-6 border-t">
        <Copyright />
      </div>
    </AuthLayout>
  );
};
