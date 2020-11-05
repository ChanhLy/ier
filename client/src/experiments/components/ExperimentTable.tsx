import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Space, Table, Tag } from 'antd';
import { ColumnType } from 'antd/lib/table';
import Axios from 'axios';
import React, { useContext } from 'react';
import { Experiment } from '..';
import { UserContext } from '../../users/UserContext';
import { CONDUCTED_BY, METHOD, RESULT, SAMPLE_ID, TARGET, UNIT } from '../../utils/constants';

interface Props {
  columns?: ColumnType<Experiment>[];
  experiments?: Experiment[];
  loading?: boolean;
  onEdit?: (experiment: Experiment) => void;
  onDelete?: (id: string | number) => void;
}

export function ExperimentTable(props: Props) {
  const { user } = useContext(UserContext);
  const { onEdit, onDelete, experiments } = props;
  const columns =
    props.columns || Object.values(experimentColumns({ onEdit, onDelete, experiments, username: user.username }));

  return (
    <Table<Experiment>
      loading={props.loading}
      columns={columns}
      dataSource={props.experiments || []}
      bordered
      rowClassName={rowClassName}
    />
  );

  function rowClassName(experiment: Experiment, index: number): string {
    if (!experiment.readBy?.includes(user.username)) {
      return 'unread-row';
    }
    return '';
  }
}

export const experimentColumns: (props: {
  onEdit?: (experiment: Experiment) => void;
  onDelete?: (id: string | number) => void;
  experiments?: Experiment[];
  username?: string;
}) => { [key: string]: ColumnType<Experiment> } = ({ onEdit, onDelete, experiments = [] }) => ({
  sample: {
    title: SAMPLE_ID,
    dataIndex: 'sample',
    filters: [...Array.from(new Set(Object.values(experiments.map((experiment) => experiment.sample))))].map(
      (sample) => ({
        text: sample as string,
        value: sample as string,
      })
    ),
    onFilter: (value, experiment) => value === experiment.sample,
  },
  target: { title: TARGET, dataIndex: 'target' },
  methods: {
    title: METHOD,
    dataIndex: 'methods',
    render: (methods: string[]) => methods.map((method) => <Tag>{method}</Tag>),
  },
  unit: { title: UNIT, dataIndex: 'unit' },
  result: { title: RESULT, dataIndex: 'result' },
  conductedBy: { title: CONDUCTED_BY, dataIndex: 'conductedBy' },

  actions: {
    title: <Button icon={<EyeOutlined />} onClick={() => Axios.put('/api/experiments/seen')} type='primary' />,
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
