import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { BoxPage } from './boxes/BoxPage';
import { RootPage } from './boxes/RootPage';

export function BoxesPage() {
  const { path } = useRouteMatch();

  return (
    <div>
      <Switch>
        <Route exact path={`${path}`}>
          <RootPage />
        </Route>
        <Route path={`${path}/:boxId`}>
          <BoxPage />
        </Route>
      </Switch>
    </div>
  );
}
