import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Space, Table, Tag } from 'antd';
import { ColumnType } from 'antd/lib/table';
import React from 'react';
import { Experiment } from '..';
import { METHOD, SAMPLE_ID, TARGET } from '../../utils/constants';

interface Props {
  columns?: ColumnType<Experiment>[];
  experiments?: Experiment[];
  loading?: boolean;
  onEdit?: (experiment: Experiment) => void;
  onDelete?: (id: string | number) => void;
}

export function ExperimentTable(props: Props) {
  const { onEdit, onDelete } = props;
  const columns = props.columns || Object.values(experimentColumns({ onEdit, onDelete }));

  return (
    <Table<Experiment> loading={props.loading} columns={columns} dataSource={props.experiments || []} bordered></Table>
  );
}

export const experimentColumns: (actions: {
  onEdit?: (experiment: Experiment) => void;
  onDelete?: (id: string | number) => void;
}) => { [key: string]: ColumnType<Experiment> } = ({ onEdit, onDelete }) => ({
  sample: { title: SAMPLE_ID, dataIndex: 'sample' },
  target: { title: TARGET, dataIndex: 'target' },
  methods: {
    title: METHOD,
    dataIndex: 'methods',
    render: (methods: string[]) => methods.map((method) => <Tag>{method}</Tag>),
  },
  actions: {
    render: (value, record, index) => {
      return (
        <Space>
          {onEdit && <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />}
          {onDelete && <Button icon={<DeleteOutlined />} onClick={() => onDelete(record._id || index)} danger />}
        </Space>
      );
    },
  },
});
