import { PageHeader, Skeleton } from 'antd';
import { Store } from 'antd/lib/form/interface';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Sample } from '..';
import { SAMPLE } from '../../utils/constants';
import { SampleForm } from '../components/SampleForm';

export function EditSamplePage() {
  const { id } = useParams();
  const [sample, setSample] = useState<Sample>();
  const history = useHistory();

  useEffect(() => {
    if (!id) return;
    Axios.get('/api/samples/' + id).then((response) => {
      if (response?.data) {
        setSample(response.data);
      }
    });
  }, [id]);

  return (
    <>
      <PageHeader title={SAMPLE} subTitle={id}></PageHeader>
      <div className='content'>
        {!sample ? (
          <Skeleton loading={true} />
        ) : (
          <div style={{ width: 800 }}>
            <SampleForm initialValues={sample} onFinish={onEditSample} />
          </div>
        )}
      </div>
    </>
  );

  async function onEditSample(values: Store) {
    Axios.put('/api/samples/' + id, values).finally(() => {
      history.push('/samples');
    });
  }
}
