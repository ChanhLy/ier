import { PageHeader } from 'antd';
import React from 'react';
import { LIST_CONTRACT } from '../../utils/constants';
import { ContractsTable } from '../components/ContractsTable';

export const ListContractsPage = () => {
  return (
    <>
      <PageHeader title={LIST_CONTRACT}></PageHeader>
      <div className='content'>
        <ContractsTable />
      </div>
    </>
  );
};
