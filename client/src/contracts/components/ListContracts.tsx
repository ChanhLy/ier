import { Button, Table } from 'antd';
import Axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../users/UserContext';
import { CREATE_NEW_CONTRACT } from '../../utils/constants';
import { URLs } from '../../utils/urls';
import { Contract } from '../contracts.model';
import { contractColumns } from './contractColumns';

export function ListContracts() {
  const user = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState([]);
  useEffect(() => {
    Axios.get('/api/contracts').then((response) => {
      setLoading(false);
      setContracts(response.data);
    });
  }, []);

  return (
    <>
      <Button>
        <Link to={URLs.CONTRACTS_CREATE}>{CREATE_NEW_CONTRACT}</Link>
      </Button>
      <br />
      <br />
      <Table
        columns={contractColumns}
        dataSource={contracts}
        rowKey='_id'
        bordered={true}
        loading={loading}
        rowClassName={rowClassName}
      ></Table>
    </>
  );

  function rowClassName(contract: Contract, index: number): string {
    if (!contract.readBy?.includes(user.id)) {
      return 'unread-row';
    }
    return '';
  }
}
