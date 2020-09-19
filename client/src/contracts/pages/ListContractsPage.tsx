import { Button, PageHeader } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { CREATE_NEW_CONTRACT, LIST_CONTRACT } from '../../utils/constants';
import { URLs } from '../../utils/urls';
import { ContractsTable } from '../components/ContractsTable';

export const ListContractsPage = () => {
  return (
    <>
      <PageHeader title={LIST_CONTRACT}></PageHeader>
      <div className='content'>
        <Button type='primary'>
          <Link to={URLs.CONTRACTS_CREATE}>{CREATE_NEW_CONTRACT}</Link>
        </Button>
        <br />
        <br />
        <ContractsTable />
      </div>
    </>
  );
};
