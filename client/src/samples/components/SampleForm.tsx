import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Row, Select, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { Store } from 'antd/lib/form/interface';
import React, { useState } from 'react';
import { ADD_TARGET, CONFIRM, METHOD, NOTE, TARGET } from '../../utils/constants';
import { methodOptions, targetOptions, typeOptions } from '../helpers/methods';
import { SYMBOLS } from '../helpers/symbols';

interface Props {
  onFinish: (values: Store) => Promise<void>;
}

export function SampleForm(props: Props) {
  const [form] = useForm();

  const [type, setType] = useState<string>();
  const [disabledAddTargetButton, setDisabledAddTargetButton] = useState(true);

  const [target, setTarget] = useState<string>();
  const [disabledSelectMethods, setDisabledSelectMethods] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Form form={form} labelCol={{ span: 4 }} onFinish={onFinish}>
      <Form.Item label='Ký hiệu mẫu' name='symbol' required wrapperCol={{ span: 2 }}>
        <Select autoFocus options={SYMBOLS}></Select>
      </Form.Item>
      <Form.Item label='Vị trí lấy mẫu' name='location' required wrapperCol={{ span: 8 }}>
        <Input />
      </Form.Item>
      <Form.Item label='Mô tả mẫu' name='description' required wrapperCol={{ span: 8 }}>
        <Input />
      </Form.Item>
      <Form.Item label='Số lượng ' name='amount' wrapperCol={{ span: 2 }}>
        <Input />
      </Form.Item>
      <Form.Item label='Đơn vị' name='unit' wrapperCol={{ span: 2 }}>
        <Input />
      </Form.Item>
      <Form.Item label='Loại mẫu theo nhóm chỉ tiêu' name='type' wrapperCol={{ span: 8 }}>
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
                      name={[field.name, 'targets']}
                      fieldKey={[field.fieldKey, 'targets']}
                      rules={[{ required: true, message: 'Missing targets' }]}
                    >
                      <Select
                        placeholder={TARGET}
                        options={targetOptions(type)}
                        onChange={onChangeTarget}
                        style={{ width: 200 }}
                      />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'method']}
                      fieldKey={[field.fieldKey, 'method']}
                      rules={[{ required: true, message: 'Missing method' }]}
                    >
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

              <Form.Item wrapperCol={{ span: 8, offset: 4 }}>
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

      <Form.Item label={NOTE} wrapperCol={{ span: 12 }} name='note'>
        <Input.TextArea />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 4 }}>
        <Button htmlType='submit' type='primary' loading={isSubmitting}>
          {CONFIRM}
        </Button>
      </Form.Item>
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
    setIsSubmitting(true);
    console.log(values);

    props.onFinish(values).catch((error) => {
      console.error(error);
      message.error('Lỗi máy chủ');
      setIsSubmitting(false);
    });
  }
}
