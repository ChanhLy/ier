import React from 'react';
import { Route } from 'react-router-dom';
import { URLs } from '../utils/urls';
import { CreateContractPage } from './pages/CreateContractPage';
import { EditContractPage } from './pages/EditContractPage';
import { ListContractsPage } from './pages/ListContractsPage';

const createContractRoute = (
  <Route exact={true} path={URLs.CONTRACTS_CREATE} key={URLs.CONTRACTS_CREATE}>
    <CreateContractPage />
  </Route>
);

const listContractsRoute = (
  <Route exact={true} path={URLs.CONTRACTS} key={URLs.CONTRACTS}>
    <ListContractsPage />
  </Route>
);

const editContractRoute = (
  <Route path={URLs.CONTRACTS_ID} key={URLs.CONTRACTS_ID}>
    <EditContractPage />
  </Route>
);

export const contractsRoutes = [createContractRoute, editContractRoute, listContractsRoute];
