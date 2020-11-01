import { Modal, PageHeader } from 'antd';
import Axios from 'axios';
import React, { ReactText, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import io from 'socket.io-client';
import { Sample } from '..';
import { DELETE_SAMPLE, LIST_SAMPLE } from '../../utils/constants';
import { SampleTable } from '../components/SampleTable';

const socket = io();

export function ListSamplesPage() {
  const [samples, setSamples] = useState<Sample[]>([]);

  const [loading, setLoading] = useState(true);

  const history = useHistory();

  useEffect(() => {}, []);

  useEffect(() => {
    if (!loading) {
      return;
    }
    Axios.get('/api/samples')
      .then((response) => response?.data && setSamples(response.data))
      .finally(() => {
        setLoading(false);
      });
  }, [loading]);

  useEffect(() => {
    socket.on('Refresh_Samples', function () {
      Axios.get('/api/samples').then((response) => response?.data && setSamples(response.data));
    });
    return () => {
      socket.off('Refresh_Samples');
    };
  }, []);

  const actions = { onEdit, onDelete };

  return (
    <>
      <PageHeader title={LIST_SAMPLE}></PageHeader>
      <div className='content'>
        <SampleTable dataSource={samples} actions={actions} loading={loading} />
      </div>
    </>
  );

  function onEdit(id: ReactText) {
    history.push(`/samples/${id}`);
  }

  function onDelete(id: ReactText) {
    Modal.confirm({
      title: `${DELETE_SAMPLE} ${id}`,
      onOk: async () => {
        await Axios.delete('/api/samples/' + id);
        setLoading(true);
      },
    });
  }
}
