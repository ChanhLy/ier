import { Table } from 'antd';
import { ColumnType } from 'antd/lib/table';
import React from 'react';
import { Experiment } from '..';
import { METHOD, SAMPLE_ID } from '../../utils/constants';

interface Props {
  columns?: ColumnType<Experiment>[];
  experiments?: Experiment[];
}

export function ExperimentTable(props: Props) {
  const columns = props.columns || Object.values(experimentColumns);

  return <Table<Experiment> columns={columns} dataSource={props.experiments || []} bordered></Table>;
}

export const experimentColumns: { [key: string]: ColumnType<Experiment> } = {
  sample: { title: SAMPLE_ID, dataIndex: 'sample' },
  methods: { title: METHOD, dataIndex: 'methods' },
};
