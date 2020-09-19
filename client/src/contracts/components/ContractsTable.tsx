import { Table } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { UserContext } from '../../users/UserContext';
import { Contract } from '../contracts.model';
import { getContracts } from '../contracts.service';
import { contractColumns } from '../helpers/contractColumns';

const socket = io();

export function ContractsTable() {
  const user = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState([]);
  useEffect(() => {
    if (loading) {
      getContracts().then((value) => {
        setLoading(false);
        setContracts(value);
      });
    }
  }, [loading]);

  useEffect(() => {
    socket.on('Refresh_Contracts', function () {
      setLoading(true);
    });
    return () => {
      socket.off('Refresh_Contracts');
    };
  }, []);

  return (
    <Table
      columns={contractColumns}
      dataSource={contracts}
      rowKey='_id'
      bordered={true}
      loading={loading}
      rowClassName={rowClassName}
    />
  );

  function rowClassName(contract: Contract, index: number): string {
    if (!contract.readBy?.includes(user.id)) {
      return 'unread-row';
    }
    return '';
  }
}
