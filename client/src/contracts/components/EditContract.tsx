import { Button, Modal, notification } from 'antd';
import { Store } from 'antd/lib/form/interface';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Sample, SampleForm, SampleTable } from '../../samples';
import { ADD_NEW_SAMPLE, DELETE_SAMPLE, FAILURE, SUCCESS, SUCCESSFULLY } from '../../utils/constants';
import { APIs, URLs } from '../../utils/urls';
import { Contract } from '../contracts.model';
import { ContractForm } from './ContractForm';

interface Props {
  contract: Contract;
}

const labelCol = { span: 4 };
const wrapperCol = { span: 12 };

export function EditContract(props: Props) {
  const history = useHistory();
  const { contract } = props;

  const [samples, setSamples] = useState<Sample[]>([]);

  useEffect(() => {
    setSamples(contract.samples);
  }, [contract.samples]);

  const [visible, setVisible] = useState(false);
  const [loadingDeleteSample, setLoadingDeleteSample] = useState(false);

  const [loadingSamples, setLoadingSamples] = useState(false);

  useEffect(() => {
    if (loadingSamples) {
      Axios.get('/api/samples/', { params: { contract: contract._id } })
        .then((response) => {
          if (response.data) {
            setSamples(response.data);
          }
        })
        .finally(() => setLoadingSamples(false));
    }
  }, [loadingSamples]);

  const actions = { onEdit, onDelete };
  return (
    <>
      <ContractForm value={contract} onFinish={onFinish} labelCol={labelCol} wrapperCol={wrapperCol}>
        <Button type='primary' onClick={onClickAddSample}>
          {ADD_NEW_SAMPLE}
        </Button>
        <br />
        <br />
        <SampleTable dataSource={samples} actions={actions} loading={loadingSamples} />
        <br />
      </ContractForm>
      <Modal
        visible={visible}
        onCancel={closeSampleForm}
        title={ADD_NEW_SAMPLE}
        width={800}
        okButtonProps={{ htmlType: 'submit', form: 'sampleForm' }}
      >
        <SampleForm onFinish={onSubmitSample} visible={visible} id='sampleForm' />
      </Modal>
    </>
  );

  function onEdit(i: string | number) {}
  function onDelete(id: string | number) {
    const source = Axios.CancelToken.source();
    Modal.confirm({
      title: DELETE_SAMPLE,
      content: `${DELETE_SAMPLE} ${id}`,
      onCancel: () => {
        return source.cancel();
      },
      onOk: async () => {
        setLoadingDeleteSample(true);
        try {
          await Axios.delete(`/api/samples/${id}`, { cancelToken: source.token });
          notification.success({ message: `${DELETE_SAMPLE} ${id} ${SUCCESSFULLY}` });
        } finally {
          setLoadingDeleteSample(false);
          setLoadingSamples(true);
        }
      },
      okButtonProps: { loading: loadingDeleteSample },
    });
  }

  async function onFinish(value: Store) {
    await Axios.put(APIs.CONTRACTS + '/' + contract._id, value);
    history.push(URLs.CONTRACTS);
  }
  async function onSubmitSample(values: Store) {
    try {
      await Axios.post('/api/samples', { ...values, contract: contract._id });
      notification.success({ message: SUCCESS });
    } catch (error) {
      notification.error({ message: FAILURE });
    }
    setVisible(false);
    setLoadingSamples(true);
  }

  function onClickAddSample(e: React.MouseEvent) {
    e.preventDefault();
    setVisible(true);
  }

  function closeSampleForm(e: React.MouseEvent) {
    e.preventDefault();
    setVisible(false);
  }
}
