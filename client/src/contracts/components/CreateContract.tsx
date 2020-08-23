import { Store } from 'antd/lib/form/interface';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { URLs } from '../../utils/urls';
import { createContract } from '../contracts.service';
import { ContractForm } from './ContractForm';

export function CreateContract() {
  const history = useHistory();

  return <ContractForm onFinish={onFinish} />;

  async function onFinish(value: Store) {
    await createContract(value);
    history.push(URLs.CONTRACTS);
  }
}
