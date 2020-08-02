import { Store } from 'antd/lib/form/interface';
import Axios from 'axios';
import React from 'react';
import { ContractForm } from './components/ContractForm';

export function CreateContract() {
  return <ContractForm onFinish={onFinish} />;

  async function onFinish(value: Store) {
    await Axios.post('/api/contracts', value);
  }
}
