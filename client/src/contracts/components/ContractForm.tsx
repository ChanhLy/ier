import { Button, Divider, Form, Input, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { Store } from 'antd/lib/form/interface';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { DatePicker } from '../../components';
import {
  ADDRESS,
  CUSTOMER_INFORMATION,
  CUSTOMER_NAME,
  DAY,
  FAX,
  NOTE,
  PHONE_NUMBER,
  REPRESENTATIVES,
  RESULT_RETURN_DATE,
  SAMPLE_RECEIVED_DATE,
  SAMPLING_LOCATION,
  TAX_CODE,
} from '../../utils/constants';
import { Contract } from '../Contract';

const { Item } = Form;

interface Props {
  onFinish: (value: Store) => Promise<void>;
  value?: Contract;
}

export function ContractForm(props: Props) {
  const [form] = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (props.value) {
      form.setFieldsValue(props.value);
    }
  }, [form, props.value]);

  return (
    <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 12 }} onFinish={onFinish}>
      <Divider orientation='left'>{CUSTOMER_INFORMATION}</Divider>
      {CustomerPhone()}
      {CustomerName()}
      {CustomerAddress()}
      {CustomerTax()}
      {CustomerRepresentative()}
      {CustomerFax()}
      <Divider />
      {SamplingLocation()}
      {SampleReceivedDate()}
      {ResultReturnDate()}
      {Note()}
      {SubmitButton()}
    </Form>
  );

  function renderExtraFooter() {
    function setResultReturnDate(days: number) {
      form.setFieldsValue({ resultReturnDate: dayjs().add(days, 'day') });
    }
    function PickDate(props: { days: number }) {
      function onSetResultReturnDateClick() {
        setResultReturnDate(props.days);
      }
      return (
        <Button onClick={onSetResultReturnDateClick} type='link'>
          {props.days} {DAY}
        </Button>
      );
    }
    return (
      <Space>
        <PickDate days={2} />
        <PickDate days={7} />
        <PickDate days={10} />
      </Space>
    );
  }

  async function onFinish(value: Store) {
    setIsSubmitting(true);
    await props.onFinish(value);
    setIsSubmitting(false);
  }
  function ResultReturnDate() {
    return (
      <Item
        label={RESULT_RETURN_DATE}
        name='resultReturnDate'
        rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
      >
        <DatePicker format='DD-MM-YYYY' showToday={false} renderExtraFooter={renderExtraFooter} />
      </Item>
    );
  }
  function SubmitButton() {
    return (
      <Item wrapperCol={{ offset: 4 }}>
        <Button htmlType='submit' type='primary' loading={isSubmitting}>
          Xác nhận
        </Button>
      </Item>
    );
  }

  function CustomerName() {
    return (
      <Item
        label={CUSTOMER_NAME}
        name={['customer', 'name']}
        rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
      >
        <Input />
      </Item>
    );
  }
  function CustomerPhone() {
    return (
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
    );
  }
  function CustomerAddress() {
    return (
      <Item
        label={ADDRESS}
        name={['customer', 'address']}
        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ khách hàng!' }]}
      >
        <Input />
      </Item>
    );
  }
  function CustomerTax() {
    return (
      <Item label={TAX_CODE} name={['customer', 'tax']}>
        <Input />
      </Item>
    );
  }
  function CustomerRepresentative() {
    return (
      <Item label={REPRESENTATIVES} name={['customer', 'representative']}>
        <Input />
      </Item>
    );
  }
  function CustomerFax() {
    return (
      <Item label={FAX} name={['customer', 'fax']}>
        <Input />
      </Item>
    );
  }
  function SamplingLocation() {
    return (
      <Item
        label={SAMPLING_LOCATION}
        name='samplingLocation'
        rules={[{ required: true, message: 'Vui lòng nhập vị trí lấy mẫu!' }]}
      >
        <Input />
      </Item>
    );
  }
  function SampleReceivedDate() {
    return (
      <Item
        label={SAMPLE_RECEIVED_DATE}
        name='sampleReceivedDate'
        rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
      >
        <DatePicker format='DD-MM-YYYY' />
      </Item>
    );
  }
  function Note() {
    return (
      <Item label={NOTE} name='note'>
        <Input />
      </Item>
    );
  }
}
