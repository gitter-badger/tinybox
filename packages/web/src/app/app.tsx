import { Link, Route, Switch, useHistory } from 'react-router-dom';
import { setAuthenticated, setCurrentUser } from './redux/actions';
import { useDispatch, useSelector } from 'react-redux';

import { CreateAccountPage } from './pages/CreateAccountPage';
import { LoginPage } from './pages/LoginPage';
import { rpc } from './api';
import { useEffect } from 'react';

export function App() {
  const authenticated = useSelector((state: any) => state.auth.authenticated);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    rpc('getCurrentUser', {})
      .then(() => {
        dispatch(setAuthenticated(true));
      })
      .catch(() => {
        history.push('/login');
      });
  }, []);

  useEffect(() => {
    if (authenticated) {
      rpc('getCurrentUser', {})
        .then((resp) => {
          dispatch(setCurrentUser(resp));
        })
        // TODO: Handle error here properly.
        .catch((e) => console.log(e));
    }
  }, [authenticated]);

  return (
    <div>
      <Switch>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="/create_account">
          <CreateAccountPage />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
