import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { ColumnType } from 'antd/lib/table';
import React from 'react';
import { Experiment, Sample } from '..';
import {
  AMOUNT,
  NOTE,
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
        console.log(experiment);
        const target = experiment.target;
        const methods = experiment.methods?.join(',');
        return target + (methods ? ` (${methods})` : '');
      })
      .join(', ') + ` (${value.length} chỉ tiêu)`
  );
}
export const idColumn: ColumnType<Sample> = { title: SAMPLE_ID, dataIndex: '_id' };
export const actionColumn: (actions: Actions) => ColumnType<Sample> = (actions) => ({
  dataIndex: '_id',
  render: (value, record, index) => (
    <>
      <Button icon={<EditOutlined />} onClick={() => actions.onEdit(value || index)} />
      <Button icon={<DeleteOutlined />} onClick={() => actions.onDelete(value || index)} danger />
    </>
  ),
});

export interface Actions {
  onEdit: (i: string | number) => void;
  onDelete: (i: string | number) => void;
}
