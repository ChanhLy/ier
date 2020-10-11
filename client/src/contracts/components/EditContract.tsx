import { Button, Modal } from 'antd';
import { Store } from 'antd/lib/form/interface';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Sample, SampleForm, SampleTable } from '../../samples';
import { ADD_NEW_SAMPLE, DELETE_SAMPLE, SUCCESSFULLY } from '../../utils/constants';
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

  const actions = { onEdit, onDelete };
  return (
    <>
      <ContractForm value={contract} onFinish={onFinish} labelCol={labelCol} wrapperCol={wrapperCol}>
        <Button type='primary' onClick={onClickAddSample}>
          {ADD_NEW_SAMPLE}
        </Button>
        <br />
        <br />
        <SampleTable dataSource={samples} actions={actions} />
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
        const response = await Axios.delete(`/api/samples/${id}`, { cancelToken: source.token });
        if (response) Modal.success({ content: `${DELETE_SAMPLE} ${id} ${SUCCESSFULLY}` });
        setLoadingDeleteSample(false);
      },
      okButtonProps: { loading: loadingDeleteSample },
    });
  }

  async function onFinish(value: Store) {
    await Axios.put(APIs.CONTRACTS + '/' + contract._id, value);
    history.push(URLs.CONTRACTS);
  }
  async function onSubmitSample(values: Store) {
    setSamples([...samples, values as Sample]);
    setVisible(false);
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
