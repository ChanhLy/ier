import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Select, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React from 'react';
import { METHOD, TARGET } from '../../utils/constants';
import { SYMBOLS } from '../samples.model';

export function SampleForm() {
  const [form] = useForm();
  return (
    <Form form={form} labelCol={{ span: 4 }}>
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
                      <Select placeholder={TARGET} />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'method']}
                      fieldKey={[field.fieldKey, 'method']}
                      rules={[{ required: true, message: 'Missing method' }]}
                    >
                      <Input placeholder={METHOD} />
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

              <Form.Item label=' ' colon={false} wrapperCol={{ span: 8 }}>
                <Button
                  type='dashed'
                  onClick={() => {
                    add();
                  }}
                  block
                >
                  <PlusOutlined /> Add field
                </Button>
              </Form.Item>
            </div>
          );
        }}
      </Form.List>
    </Form>
  );
}
