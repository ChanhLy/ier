import React from 'react';
import { Route } from 'react-router-dom';
import { URLS } from '../utils/urls';
import { CreateSample } from './CreateSample';
import { EditSample } from './EditSample';
import { ListSamples } from './ListSamples';

export const CreateSampleRoute = (
  <Route exact={true} path={URLS.SAMPLES_CREATE}>
    <CreateSample />
  </Route>
);

export const EditSampleRoute = (
  <Route path={URLS.SAMPLES_ID}>
    <EditSample />
  </Route>
);

export const ListSamplesRoute = (
  <Route exact={true} path={URLS.SAMPLES}>
    <ListSamples />
  </Route>
);
