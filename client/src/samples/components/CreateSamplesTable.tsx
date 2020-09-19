import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { Experiment, Sample } from '..';
import {
  AMOUNT,
  NOTE,
  SAMPLE_DESCRIPTION,
  SAMPLE_SYMBOL,
  SAMPLE_TYPE,
  SAMPLING_LOCATION,
  TARGET_AND_METHOD,
  UNIT,
} from '../../utils/constants';

interface Props {
  dataSource: Sample[];
}

export function CreateSamplesTable(props: Props) {
  return <Table<Sample> columns={columns} bordered dataSource={props.dataSource}></Table>;
}

const columns: ColumnsType<Sample> = [
  { title: SAMPLE_SYMBOL, dataIndex: 'symbol' },
  { title: SAMPLING_LOCATION, dataIndex: 'location' },
  { title: SAMPLE_DESCRIPTION, dataIndex: 'description' },
  { title: AMOUNT, dataIndex: 'amount' },
  { title: UNIT, dataIndex: 'unit' },
  { title: SAMPLE_TYPE, dataIndex: 'type' },
  {
    title: TARGET_AND_METHOD,
    dataIndex: 'experiments',
    render: (value: Experiment[], record: Sample, index: number) => {
      return toTargetAndMethods(value);
    },
  },
  { title: NOTE, dataIndex: 'note' },
];

export function toTargetAndMethods(value: Experiment[]) {
  return (
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
