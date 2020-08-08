import React from 'react';
import { Route } from 'react-router-dom';
import { URLs } from '../utils/urls';
import { CreateContractPage } from './pages/CreateContractPage';
import { ListContractsPage } from './pages/ListContractsPage';

const createContractRoute = (
  <Route exact={true} path={URLs.CONTRACTS_CREATE}>
    <CreateContractPage />
  </Route>
);

const listContractsRoute = (
  <Route exact={true} path={URLs.CONTRACTS}>
    <ListContractsPage />
  </Route>
);

const editContractRoute = (
  <Route path={URLs.CONTRACTS_ID}>
    <ListContractsPage />
  </Route>
);

export const contractsRoutes = [createContractRoute, listContractsRoute, editContractRoute];
