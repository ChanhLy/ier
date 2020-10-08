import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { Sample } from '..';
import {
  actionColumn,
  Actions,
  amountColumn,
  descriptionColumn,
  experimentsColumn,
  locationColumn,
  noteColumn,
  symbolColumn,
  typeColumn,
  unitColumn,
} from '../helpers/sampleColumns';

interface Props {
  dataSource: Sample[];
  actions: Actions;
}

export function CreateSamplesTable(props: Props) {
  const columns: ColumnsType<Sample> = [
    symbolColumn,
    locationColumn,
    descriptionColumn,
    amountColumn,
    unitColumn,
    typeColumn,
    experimentsColumn,
    noteColumn,
    actionColumn(props.actions),
  ];
  return <Table<Sample> columns={columns} bordered dataSource={props.dataSource}></Table>;
}
