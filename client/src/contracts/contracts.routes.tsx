import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { URLs } from '../utils/urls';
import { CreateContractPage } from './pages/CreateContractPage';
import { EditContractPage } from './pages/EditContractPage';
import { ListContractsPage } from './pages/ListContractsPage';

export function ContractsRoutes() {
  return (
    <Switch>
      <Route exact={true} path={URLs.CONTRACTS_CREATE}>
        <CreateContractPage />
      </Route>
      <Route exact={true} path={URLs.CONTRACTS}>
        <ListContractsPage />
      </Route>
      <Route path={URLs.CONTRACTS_ID}>
        <EditContractPage />
      </Route>
    </Switch>
  );
}
