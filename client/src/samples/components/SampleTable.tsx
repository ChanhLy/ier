import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { Sample } from '..';
import {
  amountColumn,
  descriptionColumn,
  experimentsColumn,
  idColumn,
  locationColumn,
  noteColumn,
  symbolColumn,
  typeColumn,
  unitColumn,
} from '../helpers/sampleColumns';

interface Props {
  dataSource: Sample[];
}

export function SampleTable(props: Props) {
  return <Table<Sample> columns={columns} bordered dataSource={props.dataSource}></Table>;
}

const columns: ColumnsType<Sample> = [
  idColumn,
  symbolColumn,
  locationColumn,
  descriptionColumn,
  amountColumn,
  unitColumn,
  typeColumn,
  experimentsColumn,
  noteColumn,
];
