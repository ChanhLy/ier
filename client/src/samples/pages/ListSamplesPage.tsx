import { Form, Modal, PageHeader, Select } from 'antd';
import Axios from 'axios';
import React, { ReactText, useEffect, useState } from 'react';
import { Sample } from '..';
import { DatePicker } from '../../components';
import { CUSTOMER_ID, DELETE_SAMPLE, LIST_SAMPLE } from '../../utils/constants';
import { SampleTable } from '../components/SampleTable';

export function ListSamplesPage() {
  const [samples, setSamples] = useState<Sample[]>([]);

  const [loading, setLoading] = useState(true);

  const [contractIds, setContractIds] = useState<string[]>([]);

  useEffect(() => {
    Axios.get('/api/customers/id').then((response) => setContractIds(response?.data || []));
  }, []);

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
        <Form layout='horizontal'>
          <Form.Item name='date' label='Tháng năm'>
            <DatePicker format='MMMM, YYYY' picker='month' />
          </Form.Item>
          <Form.Item name='contract' label={CUSTOMER_ID}>
            <Select options={contractIds?.map((id) => ({ label: id, value: id }))}></Select>
          </Form.Item>
        </Form>
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
