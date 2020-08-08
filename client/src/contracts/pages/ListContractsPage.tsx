import { PageHeader } from 'antd';
import React from 'react';
import { LIST_CONTRACT } from '../../utils/constants';
import { ListContracts } from '../components/ListContracts';

export const ListContractsPage = () => {
  return (
    <>
      <PageHeader title={LIST_CONTRACT}></PageHeader>
      <div className='content'>
        <ListContracts />
      </div>
    </>
  );
};
