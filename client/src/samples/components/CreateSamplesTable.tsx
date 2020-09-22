import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { Sample } from '..';
import {
  amountColumn,
  descriptionColumn,
  experimentsColumn,
  locationColumn,
  noteColumn,
  symbolColumn,
  typeColumn,
  unitColumn,
} from './SampleTable';

interface Props {
  dataSource: Sample[];
}

export function CreateSamplesTable(props: Props) {
  return <Table<Sample> columns={columns} bordered dataSource={props.dataSource}></Table>;
}

const columns: ColumnsType<Sample> = [
  symbolColumn,
  locationColumn,
  descriptionColumn,
  amountColumn,
  unitColumn,
  typeColumn,
  experimentsColumn,
  noteColumn,
];
