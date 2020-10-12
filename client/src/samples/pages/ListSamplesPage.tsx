import { Modal, PageHeader } from 'antd';
import Axios from 'axios';
import React, { ReactText, useEffect, useState } from 'react';
import { Sample } from '..';
import { DELETE_SAMPLE, LIST_SAMPLE } from '../../utils/constants';
import { SampleTable } from '../components/SampleTable';

export function ListSamplesPage() {
  const [samples, setSamples] = useState<Sample[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      return;
    }
    Axios.get('/api/samples')
      .then((response) => {
        if (response.data) {
          setSamples(response.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [loading]);

  const actions = { onEdit, onDelete };
  return (
    <>
      <PageHeader title={LIST_SAMPLE}></PageHeader>
      <div className='content'>
        <br />
        <br />
        <SampleTable dataSource={samples} actions={actions} loading={loading} />
      </div>
    </>
  );
  function onEdit(id: ReactText) {}
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
