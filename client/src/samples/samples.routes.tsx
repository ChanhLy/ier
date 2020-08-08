import React from 'react';
import { Route } from 'react-router-dom';
import { URLs } from '../utils/urls';
import { CreateSample } from './components/CreateSample';
import { EditSample } from './components/EditSample';
import { ListSamples } from './components/ListSamples';

const createSampleRoute = (
  <Route exact={true} path={URLs.SAMPLES_CREATE}>
    <CreateSample />
  </Route>
);

const editSampleRoute = (
  <Route path={URLs.SAMPLES_ID}>
    <EditSample />
  </Route>
);

const listSamplesRoute = (
  <Route exact={true} path={URLs.SAMPLES}>
    <ListSamples />
  </Route>
);

export const samplesRoutes = [createSampleRoute, editSampleRoute, listSamplesRoute];
