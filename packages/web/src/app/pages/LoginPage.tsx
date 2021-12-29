import { Link, useHistory } from 'react-router-dom';
import { LinkButton, PrimaryButton } from '../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { AuthLayout } from '../layouts/AuthLayout';
import { TextInput } from '../components/TextInput';
import { rpc } from '../api';
import { setAuthenticated } from '../redux/actions';

export const LoginPage = () => {
  const authenticated = useSelector((state: any) => state.auth.authenticated);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const history = useHistory();

  const login = () => {
    rpc('login', { email, password })
      .then(() => {
        // We succeed, set authenticated state
        dispatch(setAuthenticated(true));
      })
      .catch((e) => {
        window.alert(e.message);
      });
  };

  useEffect(() => {
    if (authenticated) {
      history.push('/');
    }
  }, [authenticated]);

  return (
    <AuthLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">Login</h1>
        <TextInput
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
        />
        <TextInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
        />
        <PrimaryButton className="border" onClick={login}>
          Login
        </PrimaryButton>
        <LinkButton onClick={() => history.push('/create_account')}>
          Create Account
        </LinkButton>
      </div>
    </AuthLayout>
  );
};
