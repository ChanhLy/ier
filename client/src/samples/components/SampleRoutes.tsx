import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { URLs } from '../../utils/urls';
import { EditSamplePage } from '../pages/EditSamplePage';
import { ListSamplesPage } from '../pages/ListSamplesPage';

export function SampleRoutes() {
  return (
    <Switch>
      <Route exact={true} path={URLs.SAMPLES}>
        <ListSamplesPage />
      </Route>
      <Route path={URLs.SAMPLES_ID}>
        <EditSamplePage />
      </Route>
    </Switch>
  );
}
