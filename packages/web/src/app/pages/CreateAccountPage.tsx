import { LinkButton, PrimaryButton } from '../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { AuthLayout } from '../layouts/AuthLayout';
import { TextInput } from '../components/TextInput';
import { rpc } from '../api';
import { setAuthenticated } from '../redux/actions';
import { useHistory } from 'react-router-dom';

export const CreateAccountPage = () => {
  const authenticated = useSelector((state: any) => state.auth.authenticated);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const history = useHistory();

  const createAccount = () => {
    rpc('createAccount', { name, email, password })
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
        <h1 className="text-4xl font-bold">Create Account</h1>
        <TextInput
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e: any) => setName(e.target.value)}
        />
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
        <PrimaryButton onClick={createAccount}>Create</PrimaryButton>
        <LinkButton onClick={() => history.push('/login')}>
          Login to Existing Account
        </LinkButton>
      </div>
    </AuthLayout>
  );
};
