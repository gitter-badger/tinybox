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
import { HiCheck, HiLogin } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { AuthLayout } from '../layouts/AuthLayout';
import { Copyright } from '../components/Copyright';
import { Helmet } from 'react-helmet';
import PasswordStrengthBar from 'react-password-strength-bar';
import { getPageTitle } from '../shared/helmet';
import { rpc } from '../api';
import { setAuthenticated } from '../redux/actions';
import { useHistory } from 'react-router-dom';

export const CreateAccountPage = () => {
  const authenticated = useSelector((state: any) => state.auth.authenticated);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  const createAccount = () => {
    setLoading(true);
    setErrorText('');
    rpc('createAccount', { name, email, password })
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
      history.push('/');
    }
  }, [authenticated]);

  return (
    <AuthLayout>
      <Helmet>
        <title>{getPageTitle('Create Account')}</title>
      </Helmet>
      <div className="flex flex-col gap-4">
        <Heading as="h1" size="xl">
          Create Account
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
          placeholder="Name"
          value={name}
          onChange={(e: any) => setName(e.target.value)}
          disabled={loading}
        />
        <Input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
          disabled={loading}
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
        <PasswordStrengthBar password={password} minLength={8} />
        <Button
          leftIcon={<HiCheck />}
          colorScheme="pink"
          onClick={createAccount}
          isLoading={loading}
        >
          Create
        </Button>
        <Button
          leftIcon={<HiLogin />}
          colorScheme="pink"
          variant="link"
          onClick={() => history.push('/login')}
          disabled={loading}
        >
          Login to Existing Account
        </Button>
      </div>
      <div className="pt-6 mt-6 border-t">
        <Copyright />
      </div>
    </AuthLayout>
  );
};
