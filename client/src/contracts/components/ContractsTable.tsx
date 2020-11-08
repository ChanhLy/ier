import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
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
  TAX_CODE,
} from '../../utils/constants';
import { URLs } from '../../utils/urls';
import { Contract } from '../contracts.model';

interface Props {
  contracts: Contract[];
  loading: boolean;
}

export function ContractsTable(props: Props) {
  const { user } = useContext(UserContext);

  return (
    <Table
      columns={contractColumns}
      dataSource={props.contracts}
      rowKey='_id'
      bordered={true}
      loading={props.loading}
      rowClassName={rowClassName}
    />
  );

  function rowClassName(contract: Contract, index: number): string {
    if (!contract.readBy?.includes(user.username)) {
      return 'unread-row';
    }
    return '';
  }
}

const contractColumns: ColumnsType<Contract> = [
  {
    title: CUSTOMER_ID,
    dataIndex: ['customer', '_id'],
    render: (value, record, index: number) => <Link to={URLs.CONTRACTS + '/' + record._id}>{value}</Link>,
  },
  { title: PHONE_NUMBER, dataIndex: ['customer', 'phone'] },
  { title: ADDRESS, dataIndex: ['customer', 'address'] },
  { title: TAX_CODE, dataIndex: ['customer', 'tax'] },
  { title: REPRESENTATIVES, dataIndex: ['customer', 'representative'] },
  { title: FAX, dataIndex: ['customer', 'fax'] },
  { title: SAMPLE_RECEIVED_DATE, dataIndex: 'sampleReceivedDate', render: (value) => dayjs(value).format('MM/DD') },
  { title: RESULT_RETURN_DATE, dataIndex: 'resultReturnDate', render: (value) => dayjs(value).format('MM/DD') },
  { title: NOTE, dataIndex: 'note' },
];
