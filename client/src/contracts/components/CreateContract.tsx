import { Store } from 'antd/lib/form/interface';
import Axios from 'axios';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { URLs } from '../../utils/urls';
import { ContractForm } from './ContractForm';

export function CreateContract() {
  const history = useHistory();

  return <ContractForm onFinish={onFinish} />;

  async function onFinish(value: Store) {
    const response = await Axios.post('/api/contracts', value);
    const contract = response.data;
    history.push(URLs.CONTRACTS + '/' + contract._id);
  }
}
