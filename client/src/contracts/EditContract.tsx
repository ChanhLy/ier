import { Store } from 'antd/lib/form/interface';
import Axios from 'axios';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { APIs, URLs } from '../utils/urls';
import { ContractForm } from './components/ContractForm';
import { Contract } from './Contract';

interface Props {
  contract: Contract;
}

export function EditContract(props: Props) {
  const history = useHistory();
  const contract = props.contract;

  return <ContractForm value={contract} onFinish={onFinish} />;

  async function onFinish(value: Store) {
    await Axios.put(APIs.CONTRACTS + '/' + contract._id, value);
    history.push(URLs.CONTRACTS);
  }
}
