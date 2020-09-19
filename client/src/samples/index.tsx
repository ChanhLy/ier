import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { URLs } from '../utils/urls';
import { CreateSample } from './components/CreateSample';
import { EditSample } from './components/EditSample';
import { ListSamples } from './components/ListSamples';

export { CreateSamplesTable } from './components/CreateSamplesTable';
export { SampleForm } from './components/SampleForm';
export { SampleTable } from './components/SampleTable';

export interface Experiment {
  methods?: string[];
  target: string;
}

export interface Sample {
  symbol: string;
  location: string;
  amount: string;
  description: string;
  type: string;
  experiments: [Experiment];
}

export function SampleRoutes() {
  return (
    <Switch>
      <Route exact={true} path={URLs.SAMPLES_CREATE}>
        <CreateSample />
      </Route>
      <Route path={URLs.SAMPLES_ID}>
        <EditSample />
      </Route>
      <Route exact={true} path={URLs.SAMPLES}>
        <ListSamples />
      </Route>
    </Switch>
  );
}
