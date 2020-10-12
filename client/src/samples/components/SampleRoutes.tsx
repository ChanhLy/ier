import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { URLs } from '../../utils/urls';
import { ListSamplesPage } from '../pages/ListSamplesPage';
import { CreateSample } from './CreateSample';
import { EditSample } from './EditSample';

export function SampleRoutes() {
  return (
    <Switch>
      <Route exact={true} path={URLs.SAMPLES}>
        <ListSamplesPage />
      </Route>
      <Route exact={true} path={URLs.SAMPLES_CREATE}>
        <CreateSample />
      </Route>
      <Route path={URLs.SAMPLES_ID}>
        <EditSample />
      </Route>
    </Switch>
  );
}
