import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { URLs } from '../../utils/urls';
import { ListExperimentsPage } from '../pages/ListExperimentsPage';

export function ExperimentRoutes() {
  return (
    <Switch>
      <Route exact={true} path={URLs.EXPERIMENTS}>
        <ListExperimentsPage />
      </Route>
      <Route path={URLs.EXPERIMENTS_ID}></Route>
    </Switch>
  );
}
