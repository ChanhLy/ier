import { PageHeader } from 'antd';
import confirm from 'antd/lib/modal/confirm';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Experiment } from '..';
import { ExperimentTable } from '../components/ExperimentTable';

export function ListExperimentsPage() {
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    loading &&
      Axios.get('/api/experiments')
        .then((response) => response?.data && setExperiments(response.data))
        .finally(() => setLoading(false));
  }, [loading]);

  return (
    <div>
      <PageHeader title={'Danh sách thí nghiệm'}></PageHeader>
      <div className='content'>
        <ExperimentTable
          loading={loading}
          experiments={experiments}
          onDelete={onDeleteExperiment}
          onEdit={goToEditExperimentPage}
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

  function goToEditExperimentPage(experiment: Experiment) {
    history.push('/experiments/' + experiment._id);
  }
}
