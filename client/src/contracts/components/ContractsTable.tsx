import { FileExcelOutlined } from '@ant-design/icons';
import { Button, Checkbox, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import Axios from 'axios';
import dayjs from 'dayjs';
import FileSaver from 'file-saver';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../users/UserContext';
import {
  ADDRESS,
  CUSTOMER_ID,
  FAX,
  NOTE,
  PAID,
  PHONE_NUMBER,
  REPRESENTATIVES,
  RESULT_RETURN_DATE,
  RETURNED,
  SAMPLE_RECEIVED_DATE,
  SAMPLING_LOCATION,
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
  { title: SAMPLING_LOCATION, dataIndex: 'location' },
  { title: SAMPLE_RECEIVED_DATE, dataIndex: 'sampleReceivedDate', render: (value) => dayjs(value).format('MM/DD') },
  { title: RESULT_RETURN_DATE, dataIndex: 'resultReturnDate', render: (value) => dayjs(value).format('MM/DD') },
  {
    title: PAID,
    dataIndex: 'paid',
    render: (value: boolean, record, index) => (
      <Checkbox defaultChecked={value} onChange={() => Axios.put('/api/contracts/' + record._id + '/paid')} />
    ),
  },
  {
    title: RETURNED,
    dataIndex: 'returned',
    render: (value: boolean, record, index) => (
      <Checkbox defaultChecked={value} onChange={() => Axios.put('/api/contracts/' + record._id + '/returned')} />
    ),
  },
  {
    title: NOTE,
    dataIndex: 'note',
  },
  {
    title: 'In',
    dataIndex: '_id',
    render(value, record, index) {
      return <Button icon={<FileExcelOutlined />} type='primary' onClick={() => printContract(value)} />;
    },
  },
];

async function printContract(contractId: string) {
  const response = await Axios.get('/api/contracts/' + contractId + '/print', { responseType: 'blob' });
  const data = response?.data;

  if (data) {
    FileSaver.saveAs(data, `Phieu yeu cau lay mau ${contractId}.xlsx`);
  }
}
