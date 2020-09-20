import { Button, Modal } from 'antd';
import { Store } from 'antd/lib/form/interface';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CreateSamplesTable, Sample, SampleForm } from '../../samples';
import { ADD_NEW_SAMPLE, CREATE_NEW_CONTRACT } from '../../utils/constants';
import { createContract } from '../contracts.service';
import { ContractForm } from './ContractForm';

export function CreateContract() {
  const history = useHistory();
  const labelCol = { span: 4 };
  const wrapperCol = { span: 12 };

  const [samples, setSamples] = useState<Sample[]>([]);

  const [visible, setVisible] = useState(false);

  return (
    <>
      <ContractForm onFinish={onFinish} labelCol={labelCol} wrapperCol={wrapperCol}>
        <Button type='primary' onClick={onClickAddSample}>
          {CREATE_NEW_CONTRACT}
        </Button>
        <br />
        <br />
        <CreateSamplesTable dataSource={samples} />
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

  async function onFinish(values: Store) {
    values.samples = samples;
    console.log(values);

    await createContract(values);
    // history.push(URLs.CONTRACTS);
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
