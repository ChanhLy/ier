import { Divider } from 'antd';
import { Store } from 'antd/lib/form/interface';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { SampleForm } from '../../samples/components/SampleForm';
import { URLs } from '../../utils/urls';
import { createContract } from '../contracts.service';
import { ContractForm } from './ContractForm';

export function CreateContract() {
  const history = useHistory();
  const labelCol = { span: 4 };
  const wrapperCol = { span: 12 };

  return (
    <div>
      <ContractForm onFinish={onFinish} labelCol={labelCol} wrapperCol={wrapperCol} />
      <Divider></Divider>
      <SampleForm />
    </div>
  );

  async function onFinish(value: Store) {
    await createContract(value);
    history.push(URLs.CONTRACTS);
  }
}
