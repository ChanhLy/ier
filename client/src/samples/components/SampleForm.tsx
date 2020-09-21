import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Row, Select, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { Store } from 'antd/lib/form/interface';
import React, { useEffect, useState } from 'react';
import {
  ADD_TARGET,
  AMOUNT,
  CONFIRM,
  METHOD,
  NOTE,
  SAMPLE_DESCRIPTION,
  SAMPLE_SYMBOL,
  SAMPLE_TYPE_TARGET,
  SAMPLING_LOCATION,
  TARGET,
  UNIT,
} from '../../utils/constants';
import { methodOptions, targetOptions, typeOptions } from '../helpers/methods';
import { SYMBOLS } from '../helpers/symbols';

interface Props {
  onFinish: (values: Store) => Promise<void>;
  visible?: boolean;
  id?: string;
}

export function SampleForm(props: Props) {
  const [form] = useForm();

  useEffect(() => {
    if (props.visible) {
      form.resetFields();
    }
  }, [props.visible, form]);

  const [type, setType] = useState<string>();
  const [disabledAddTargetButton, setDisabledAddTargetButton] = useState(true);

  const [target, setTarget] = useState<string>();
  const [disabledSelectMethods, setDisabledSelectMethods] = useState(true);
  return (
    <Form form={form} onFinish={onFinish} labelCol={{ style: { width: 200 } }} id={props.id}>
      <Form.Item label={SAMPLE_SYMBOL} name='symbol' rules={[{ required: true, message: 'Symbol required' }]}>
        <Select autoFocus options={symbols}></Select>
      </Form.Item>
      <Form.Item label={SAMPLING_LOCATION} name='location' rules={[{ required: true, message: 'location required' }]}>
        <Input />
      </Form.Item>
      <Form.Item
        label={SAMPLE_DESCRIPTION}
        name='description'
        rules={[{ required: true, message: 'description required' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label={AMOUNT} name='amount'>
        <Input />
      </Form.Item>
      <Form.Item label={UNIT} name='unit'>
        <Input />
      </Form.Item>
      <Form.Item label={SAMPLE_TYPE_TARGET} name='type' rules={[{ required: true, message: 'type required' }]}>
        <Select options={typeOptions} onChange={onChangeType}></Select>
      </Form.Item>
      <Form.List name='experiments'>
        {(fields, { add, remove }) => {
          return (
            <div>
              {fields.map((field) => (
                <Row key={field.key} style={{ display: 'flex' }}>
                  <Col span={4}></Col>
                  <Space align='start'>
                    <Form.Item
                      {...field}
                      name={[field.name, 'target']}
                      fieldKey={[field.fieldKey, 'target']}
                      rules={[{ required: true, message: 'Missing targets' }]}
                    >
                      <Select
                        placeholder={TARGET}
                        options={targetOptions(type)}
                        onChange={onChangeTarget}
                        style={{ width: 200 }}
                      />
                    </Form.Item>
                    <Form.Item {...field} name={[field.name, 'methods']} fieldKey={[field.fieldKey, 'methods']}>
                      <Select
                        mode='multiple'
                        placeholder={METHOD}
                        options={methodOptions(type, target)}
                        style={{ width: 200 }}
                        disabled={disabledSelectMethods}
                      />
                    </Form.Item>

                    <Button
                      icon={<MinusCircleOutlined />}
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  </Space>
                </Row>
              ))}

              <Form.Item>
                <Button
                  type='dashed'
                  onClick={() => {
                    add();
                  }}
                  block
                  disabled={disabledAddTargetButton}
                >
                  <PlusOutlined /> {ADD_TARGET}
                </Button>
              </Form.Item>
            </div>
          );
        }}
      </Form.List>

      <Form.Item label={NOTE} name='note'>
        <Input.TextArea />
      </Form.Item>

      {!props.id ? (
        <Form.Item style={{ marginLeft: 200 }}>
          <Button htmlType='submit' type='primary'>
            {CONFIRM}
          </Button>
        </Form.Item>
      ) : undefined}
    </Form>
  );

  function onChangeTarget(targetSelected: string) {
    setTarget(targetSelected);
    setDisabledSelectMethods(false);
  }

  function onChangeType(typeSelected: string) {
    setType(typeSelected);
    setDisabledAddTargetButton(false);
  }

  function onFinish(values: Store) {
    console.log(values);

    props.onFinish(values).catch((error) => {
      console.error(error);
      message.error('Lỗi máy chủ');
    });
  }
}

const symbols = SYMBOLS.map((symbol) => {
  return { label: symbol, value: symbol };
});
