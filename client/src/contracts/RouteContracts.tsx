import React from 'react';
import { Route } from 'react-router-dom';
import { URLs } from '../utils/urls';
import { CreateContract } from './CreateContract';
import { EditContract } from './EditContract';
import { ListContracts } from './ListContracts';

export const ListContractsRoute = (
  <Route exact={true} path={URLs.CONTRACTS}>
    <ListContracts />
  </Route>
);

export const CreateContractRoute = (
  <Route exact={true} path={URLs.CONTRACTS_CREATE}>
    <CreateContract />
  </Route>
);

export const EditContractRoute = (
  <Route path={URLs.CONTRACTS_ID}>
    <EditContract />
  </Route>
);
