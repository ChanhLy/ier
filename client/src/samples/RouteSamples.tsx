import React from 'react';
import { Route } from 'react-router-dom';
import { URLs } from '../utils/urls';
import { CreateSample } from './CreateSample';
import { EditSample } from './EditSample';
import { ListSamples } from './ListSamples';

export const CreateSampleRoute = (
  <Route exact={true} path={URLs.SAMPLES_CREATE}>
    <CreateSample />
  </Route>
);

export const EditSampleRoute = (
  <Route path={URLs.SAMPLES_ID}>
    <EditSample />
  </Route>
);

export const ListSamplesRoute = (
  <Route exact={true} path={URLs.SAMPLES}>
    <ListSamples />
  </Route>
);
