import { DeleteOutlined } from '@ant-design/icons';
import { Button, Checkbox } from 'antd';
import { ColumnType } from 'antd/lib/table';
import Axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';
import { Sample } from '..';
import { Experiment } from '../../experiments';
import {
  AMOUNT,
  NOTE,
  PAID,
  RETURNED,
  SAMPLE_DESCRIPTION,
  SAMPLE_ID,
  SAMPLE_SYMBOL,
  SAMPLE_TYPE,
  SAMPLING_LOCATION,
  TARGET_AND_METHOD,
  UNIT,
} from '../../utils/constants';

export const symbolColumn: ColumnType<Sample> = { title: SAMPLE_SYMBOL, dataIndex: 'symbol' };
export const locationColumn: ColumnType<Sample> = { title: SAMPLING_LOCATION, dataIndex: 'location' };
export const descriptionColumn: ColumnType<Sample> = { title: SAMPLE_DESCRIPTION, dataIndex: 'description' };
export const amountColumn: ColumnType<Sample> = { title: AMOUNT, dataIndex: 'amount' };
export const unitColumn: ColumnType<Sample> = { title: UNIT, dataIndex: 'unit' };
export const typeColumn: ColumnType<Sample> = { title: SAMPLE_TYPE, dataIndex: 'type' };
export const experimentsColumn: ColumnType<Sample> = {
  title: TARGET_AND_METHOD,
  dataIndex: 'experiments',
  render: (value: Experiment[], record: Sample, index: number) => {
    return toTargetAndMethods(value);
  },
};
export const noteColumn: ColumnType<Sample> = { title: NOTE, dataIndex: 'note' };

function toTargetAndMethods(value: Experiment[]) {
  return (
    value &&
    Array.isArray(value) &&
    value
      .map((experiment) => {
        const target = experiment.target;
        const methods = experiment.methods?.join(',');
        return target + (methods ? ` (${methods})` : '');
      })
      .join(', ') + ` (${value.length} chỉ tiêu)`
  );
}
export const idColumn: ColumnType<Sample> = {
  title: SAMPLE_ID,
  dataIndex: '_id',
  render: (value) => <Link to={`/samples/${value}`}>{value}</Link>,
};
export const actionColumn: (actions: Actions) => ColumnType<Sample> = (actions) => ({
  dataIndex: '_id',
  render: (value, record, index) => (
    <Button icon={<DeleteOutlined />} onClick={() => actions.onDelete(value || index)} danger />
  ),
});

export interface Actions {
  onEdit: (i: string | number) => void;
  onDelete: (i: string | number) => void;
}

export const paidColumn: ColumnType<Sample> = {
  title: PAID,
  dataIndex: 'paid',
  render: (value: boolean, record, index) => (
    <Checkbox defaultChecked={value} onChange={() => Axios.put('/api/samples/' + record._id + '/paid')} />
  ),
};

export const returnedColumn: ColumnType<Sample> = {
  title: RETURNED,
  dataIndex: 'returned',
  render: (value: boolean, record, index) => (
    <Checkbox defaultChecked={value} onChange={() => Axios.put('/api/samples/' + record._id + '/returned')} />
  ),
};
