import { Button, Form, Input, message, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { Store } from 'antd/lib/form/interface';
import Axios from 'axios';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { DatePicker } from '../components';
import {
  ADDRESS,
  CUSTOMER_NAME,
  FAX,
  PHONE_NUMBER,
  REPRESENTATIVES,
  RESULT_RETURN_DATE,
  SAMPLE_RECEIVED_DATE,
  SAMPLING_LOCATION,
  TAX_CODE,
} from '../utils/constants';

const { Item } = Form;

export function CreateContract() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form] = useForm();
  return (
    <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 12 }} onFinish={onFinish}>
      <Item
        label={CUSTOMER_NAME}
        name={['customer', 'name']}
        rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
      >
        <Input />
      </Item>
      <Item
        label={PHONE_NUMBER}
        name={['customer', 'phone']}
        rules={[
          { required: true, message: 'Vui lòng nhập số điện thoại!' },
          { pattern: /\d{8,12}/, message: '8 ~ 12 chữ số' },
        ]}
      >
        <Input />
      </Item>
      <Item label={TAX_CODE} name={['customer', 'tax']}>
        <Input />
      </Item>
      <Item label={REPRESENTATIVES} name={['customer', 'representatives']}>
        <Input />
      </Item>
      <Item label={FAX} name={['customer', 'fax']}>
        <Input />
      </Item>
      <Item
        label={ADDRESS}
        name={['customer', 'address']}
        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ khách hàng!' }]}
      >
        <Input />
      </Item>
      <Item
        label={SAMPLING_LOCATION}
        name='samplingLocation'
        rules={[{ required: true, message: 'Vui lòng nhập vị trí lấy mẫu!' }]}
      >
        <Input />
      </Item>
      <Item
        label={SAMPLE_RECEIVED_DATE}
        name='sampleReceivedDate'
        rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
      >
        <DatePicker format='DD-MM-YYYY' onChange={(value) => console.log(value)}></DatePicker>
      </Item>

      <Item
        label={RESULT_RETURN_DATE}
        name='resultReturnDate'
        rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
      >
        <Select>
          <Select.Option value={dayjs().add(2, 'd').format('YYYY-MM-DD')}>2 ngày</Select.Option>
          <Select.Option value={dayjs().add(7, 'd').format('YYYY-MM-DD')}>7 ngày</Select.Option>
          <Select.Option value={dayjs().add(10, 'd').format('YYYY-MM-DD')}>10 ngày</Select.Option>
        </Select>
      </Item>

      <Item wrapperCol={{ offset: 4 }}>
        <Button htmlType='submit' type='primary' loading={isSubmitting}>
          Xác nhận
        </Button>
      </Item>
    </Form>
  );

  async function onFinish(values: Store) {
    setIsSubmitting(true);
    try {
      await Axios.post('/api/contracts', values);
      message.success('Thành công');
    } catch (error) {
      message.error('Thất bại');
    } finally {
      setIsSubmitting(false);
    }
  }
}
