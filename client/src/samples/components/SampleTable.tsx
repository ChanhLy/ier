import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useContext } from 'react';
import { Sample } from '..';
import { UserContext } from '../../users/UserContext';
import {
  actionColumn,
  Actions,
  amountColumn,
  descriptionColumn,
  experimentsColumn,
  idColumn,
  locationColumn,
  noteColumn,
  paidColumn,
  returnedColumn,
  symbolColumn,
  typeColumn,
  unitColumn,
} from '../helpers/sampleColumns';

interface Props {
  dataSource: Sample[];
  actions: Actions;
  loading?: boolean;
}

export function SampleTable(props: Props) {
  const { user } = useContext(UserContext);

  const columns: ColumnsType<Sample> = [
    idColumn,
    symbolColumn,
    locationColumn,
    descriptionColumn,
    amountColumn,
    unitColumn,
    typeColumn,
    experimentsColumn,
    paidColumn,
    returnedColumn,
    noteColumn,
    actionColumn(props.actions),
  ];

  return (
    <Table<Sample>
      columns={columns}
      bordered
      dataSource={props.dataSource}
      loading={props.loading}
      rowClassName={rowClassName}
    />
  );

  function rowClassName(sample: Sample, index: number): string {
    if (!sample.readBy?.includes(user.username)) {
      return 'unread-row';
    }
    return '';
  }
}
