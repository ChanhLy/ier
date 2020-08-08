import { PageHeader } from 'antd';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { CREATE_NEW_CONTRACT_TITLE } from '../../utils/constants';
import { CreateContract } from '../components/CreateContract';

export const CreateContractPage = () => {
  const history = useHistory();
  return (
    <>
      <PageHeader title={CREATE_NEW_CONTRACT_TITLE} onBack={() => history.goBack()}></PageHeader>
      <div className='content'>
        <CreateContract />
      </div>
    </>
  );
};
