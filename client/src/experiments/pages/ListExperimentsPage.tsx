import { Button, Form, PageHeader, Space } from 'antd';
import { Store } from 'antd/lib/form/interface';
import confirm from 'antd/lib/modal/confirm';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Experiment } from '..';
import { CONFIRM } from '../../utils/constants';
import { ExperimentForm } from '../components/ExperimentForm';
import { ExperimentTable } from '../components/ExperimentTable';
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
export function ListExperimentsPage() {
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const [editingExperiment, setEditingExperiment] = useState<Experiment>();
  const [updating, setUpdating] = useState(false);
  const query = useQuery();

  useEffect(() => {
    loading &&
      Axios.get('/api/experiments')
        .then((response) => response?.data && setExperiments(response.data))
        .finally(() => setLoading(false));
  }, [loading]);

  useEffect(() => {
    const id = query.get('_id');
    if (id && id !== editingExperiment?._id) {
      Axios.get('/api/experiments/' + id).then((response) => response?.data && setEditingExperiment(response.data));
    }
  }, [query, editingExperiment]);

  return (
    <div>
      <PageHeader title={'Danh sách thí nghiệm'}></PageHeader>
      <div className='content'>
        {editingExperiment && (
          <ExperimentForm initialValues={editingExperiment} onFinish={onFinishEditingExperiment}>
            <Form.Item wrapperCol={{ offset: 4 }}>
              <Space>
                <Button htmlType='submit' type='primary' loading={updating}>
                  {CONFIRM}
                </Button>
                <Button htmlType='reset'>Trở lại ban đầu</Button>
              </Space>
            </Form.Item>
          </ExperimentForm>
        )}
        <ExperimentTable
          loading={loading}
          experiments={experiments}
          onDelete={onDeleteExperiment}
          onEdit={(experiment) => history.push('/experiments?_id=' + experiment._id)}
        />
      </div>
    </div>
  );

  function onDeleteExperiment(id: React.ReactText) {
    confirm({
      title: 'Xóa mẫu',
      onOk: () => Axios.delete('/api/experiments/' + id).finally(() => setLoading(true)),
    });
  }

  function onFinishEditingExperiment(values: Store) {
    setUpdating(true);
    Axios.put('/api/experiments/' + editingExperiment?._id, values).finally(() => {
      setUpdating(false);
      setLoading(true);
    });
  }
}
