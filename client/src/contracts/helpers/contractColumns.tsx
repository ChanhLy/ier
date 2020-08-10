import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import React from 'react';
import { Link } from 'react-router-dom';
import {
  ADDRESS,
  CUSTOMER_NAME,
  FAX,
  ID,
  NOTE,
  PHONE_NUMBER,
  REPRESENTATIVES,
  RESULT_RETURN_DATE,
  SAMPLE_RECEIVED_DATE,
  SAMPLING_LOCATION,
  TAX_CODE,
} from '../../utils/constants';
import { Contract } from '../contracts.model';

export const contractColumns: ColumnsType<Contract> = [
  {
    title: ID,
    render: (contract: Contract) => (
      <Link to={'/contracts/' + contract._id}>{contract.date.slice(-4) + '-' + contract.numberInMonth}</Link>
    ),
  },
  { title: CUSTOMER_NAME, dataIndex: ['customer', 'name'] },
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
