import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import { UserContext } from '../../users/UserContext';
import {
  ADDRESS,
  CUSTOMER_ID,
  FAX,
  NOTE,
  PHONE_NUMBER,
  REPRESENTATIVES,
  RESULT_RETURN_DATE,
  SAMPLE_RECEIVED_DATE,
  SAMPLING_LOCATION,
  TAX_CODE,
} from '../../utils/constants';
import { URLs } from '../../utils/urls';
import { Contract } from '../contracts.model';
import { getContracts } from '../contracts.service';

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

const contractColumns: ColumnsType<Contract> = [
  {
    title: CUSTOMER_ID,
    dataIndex: 'customerId',
    render: (value, record, index: number) => <Link to={URLs.CONTRACTS + '/' + record._id}>{value}</Link>,
  },
  { title: PHONE_NUMBER, dataIndex: ['customer', 'phone'] },
  { title: ADDRESS, dataIndex: ['customer', 'address'] },
  { title: TAX_CODE, dataIndex: ['customer', 'tax'] },
  { title: REPRESENTATIVES, dataIndex: ['customer', 'representative'] },
  { title: FAX, dataIndex: ['customer', 'fax'] },
  { title: SAMPLING_LOCATION, dataIndex: 'samplingLocation' },
  { title: SAMPLE_RECEIVED_DATE, dataIndex: 'sampleReceivedDate', render: (value) => dayjs(value).format('MM/DD') },
  { title: RESULT_RETURN_DATE, dataIndex: 'resultReturnDate', render: (value) => dayjs(value).format('MM/DD') },
  { title: NOTE, dataIndex: 'note' },
];
