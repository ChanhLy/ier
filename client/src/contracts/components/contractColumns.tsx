import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import { Contract } from '../Contract';

export const contractColumns: ColumnsType<Contract> = [
  { title: 'Id', render: (contract: Contract) => contract.date.slice(-4) + '-' + contract.numberInMonth },
  { title: 'customer name', dataIndex: ['customer', 'name'] },
  { title: 'tax', dataIndex: ['customer', 'tax'] },
  { title: 'representative', dataIndex: ['customer', 'representative'] },
  { title: 'phone', dataIndex: ['customer', 'phone'] },
  { title: 'fax', dataIndex: ['customer', 'fax'] },
  { title: 'address', dataIndex: ['customer', 'address'] },
  { title: 'sampling Location', dataIndex: 'samplingLocation' },
  { title: 'sample Received Date', dataIndex: 'sampleReceivedDate', render: (value) => dayjs(value).format('MM/DD') },
  { title: 'result Return Date', dataIndex: 'resultReturnDate', render: (value) => dayjs(value).format('MM/DD') },
];
