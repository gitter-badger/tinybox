import { Link, Route, Switch, useHistory } from 'react-router-dom';
import { setAuthenticated, setCurrentUser, setHomeId } from './redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { CreateAccountPage } from './pages/CreateAccountPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { SelectHomePage } from './pages/SelectHomePage';
import { rpc } from './api';

export function App() {
  const authenticated = useSelector((state: any) => state.auth.authenticated);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    rpc('getCurrentUser', {})
      .then(() => {
        dispatch(setAuthenticated(true));
        const homeId = window.localStorage.getItem('homeId');
        if (homeId) {
          dispatch(setHomeId(homeId));
        }
      })
      .catch(() => {
        history.push('/login');
      })
      .finally(() => {
        setLoading(false);
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

  if (loading) return null;

  return (
    <div>
      <Switch>
        <Route path="/dashboard">
          <DashboardPage />
        </Route>
        <Route path="/select_home">
          <SelectHomePage />
        </Route>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="/create_account">
          <CreateAccountPage />
        </Route>
        <Route path="*">
          <DefaultRoute />
        </Route>
      </Switch>
    </div>
  );
}

function DefaultRoute() {
  const history = useHistory();
  useEffect(() => {
    history.push('/login');
  }, []);
  return null;
}

export default App;
