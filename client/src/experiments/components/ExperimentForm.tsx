import { Form, Input, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { Store } from 'antd/lib/form/interface';
import React, { useEffect, useState } from 'react';
import { Experiment } from '..';
import { Sample } from '../../samples';
import { methodOptions, targetOptions } from '../../samples/helpers/methods';
import { CONDUCTED_BY, METHOD, RESULT, SAMPLE_ID, TARGET, UNIT } from '../../utils/constants';

export function ExperimentForm(props: {
  initialValues: Experiment;
  id?: string;
  onFinish: (values: Store) => void;
  children?: React.ReactNode;
}) {
  const { initialValues: experiment } = props;
  const sample = experiment.sample as Sample;
  const [target, setTarget] = useState(experiment?.target || '');
  const [disabledSelectMethods, setDisabledSelectMethods] = useState(true);

  useEffect(() => {
    setDisabledSelectMethods(!target);
  }, [target]);

  const [form] = useForm();
  useEffect(() => form.resetFields(), [props.initialValues]);

  return (
    <Form
      id={props.id}
      onFinish={props.onFinish}
      initialValues={{ ...experiment, sample: sample._id }}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 8 }}
      form={form}
      onReset={() => form.resetFields()}
    >
      <Form.Item label={SAMPLE_ID} name='sample'>
        <Input value={sample._id} disabled={true} />
      </Form.Item>
      <Form.Item label={TARGET} name='target' rules={[{ required: true, message: 'Missing targets' }]}>
        <Select
          placeholder={TARGET}
          options={targetOptions(sample.type)}
          onChange={(value: string) => {
            setTarget(value);
            form.setFieldsValue({ methods: [] });
          }}
        />
      </Form.Item>
      <Form.Item label={METHOD} name={'methods'} wrapperCol={{ span: 12 }}>
        <Select
          mode='multiple'
          placeholder={METHOD}
          options={methodOptions(sample.type, target)}
          disabled={disabledSelectMethods}
        />
      </Form.Item>
      <Form.Item label={UNIT} name='unit'>
        <Input />
      </Form.Item>
      <Form.Item label={RESULT} name='result'>
        <Input />
      </Form.Item>
      <Form.Item label={CONDUCTED_BY} name='conductedBy'>
        <Input />
      </Form.Item>
      {props.children}
    </Form>
  );
}
