import React from 'react';
import { Route } from 'react-router-dom';
import { URLS } from '../utils/urls';
import { CreateContract } from './CreateContract';
import { EditContract } from './EditContract';
import { ListContracts } from './ListContracts';

export const ListContractsRoute = (
  <Route exact={true} path={URLS.CONTRACTS}>
    <ListContracts />
  </Route>
);

export const CreateContractRoute = (
  <Route exact={true} path={URLS.CONTRACTS_CREATE}>
    <CreateContract />
  </Route>
);

export const EditContractRoute = (
  <Route path={URLS.CONTRACTS_ID}>
    <EditContract />
  </Route>
);
