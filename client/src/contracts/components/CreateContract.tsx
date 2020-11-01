import { Button, Modal } from 'antd';
import { Store } from 'antd/lib/form/interface';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CreateSamplesTable, Sample, SampleForm } from '../../samples';
import { ADD_NEW_SAMPLE } from '../../utils/constants';
import { URLs } from '../../utils/urls';
import { createContract } from '../contracts.service';
import { ContractForm } from './ContractForm';

export function CreateContract() {
  const labelCol = { span: 4 };
  const wrapperCol = { span: 12 };

  const [samples, setSamples] = useState<Sample[]>([]);

  const [visible, setVisible] = useState(false);
  const actions = { onEdit, onDelete };

  const history = useHistory();

  return (
    <>
      <ContractForm onFinish={onFinish} labelCol={labelCol} wrapperCol={wrapperCol}>
        <Button type='primary' onClick={onClickAddSample}>
          {ADD_NEW_SAMPLE}
        </Button>
        <br />
        <br />
        <CreateSamplesTable dataSource={samples} actions={actions} />
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
  function onDelete(i: string | number) {
    Modal.confirm({
      title: 'Xóa mẫu thứ ' + (Number(i) + 1),
      onOk: () => setSamples(samples.filter((sample, index) => index !== i)),
    });
  }

  async function onFinish(values: Store) {
    values.samples = samples;
    console.log(values);

    await createContract(values);
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
