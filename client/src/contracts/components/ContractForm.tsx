import { Button, Checkbox, Divider, Form, Input, Space } from 'antd';
import { FormInstance, useForm } from 'antd/lib/form/Form';
import { Store } from 'antd/lib/form/interface';
import Axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { DatePicker } from '../../components';
import { Customer } from '../../customers/Customer';
import {
  ADDRESS,
  CONFIRM,
  CONTRACT_INFORMATION,
  CUSTOMER_NAME,
  CUSTOMER_NOT_FOUND,
  DAY,
  FAX,
  NOTE,
  PHONE_NUMBER,
  REPRESENTATIVES,
  RESULT_RETURN_DATE,
  SAMPLE_RECEIVED_DATE,
  TAX_CODE,
  UPDATE_CUSTOMER_INFORMATION,
} from '../../utils/constants';
import { Contract } from '../contracts.model';

const { Item } = Form;

interface Props {
  onFinish: (values: Store) => Promise<void>;
  value?: Contract;
  labelCol: { span: number };
  wrapperCol: { span: number };
  children?: React.ReactNode;
  form?: FormInstance;
}

export function ContractForm(props: Props) {
  const [form] = useForm(props.form);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateCustomer, setUpdateCustomer] = useState(false);

  useEffect(() => {
    if (props.value) {
      form.setFieldsValue(props.value);
    }
  }, [form, props.value]);

  return (
    <Form form={form} onFinish={onFinish} labelCol={props.labelCol} wrapperCol={props.wrapperCol}>
      <Divider orientation='left'>{CONTRACT_INFORMATION}</Divider>
      <CustomerPhone />
      <CustomerName />
      <CustomerAddress />
      <CustomerTax />
      <CustomerRepresentative />
      <CustomerFax />
      <SampleReceivedDate />
      <ResultReturnDate />
      <Note />
      {props.children}
      <SubmitButton />
    </Form>
  );

  function renderExtraFooter() {
    function setResultReturnDate(days: number) {
      form.setFieldsValue({ resultReturnDate: dayjs().add(days, 'day') });
    }
    function PickDate(pickDateProps: { days: number }) {
      function onSetResultReturnDateClick() {
        setResultReturnDate(pickDateProps.days);
      }
      return (
        <Button onClick={onSetResultReturnDateClick} type='link'>
          {pickDateProps.days} {DAY}
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
    if (updateCustomer) {
      const customer = form.getFieldsValue().customer as Customer;
      await Axios.put('/api/customers', customer, { params: { phone: customer.phone } });
    }
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
          {CONFIRM}
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
    const [loading, setLoading] = useState(false);
    const [help, setHelp] = useState<string | undefined>();
    return (
      <Item
        label={PHONE_NUMBER}
        name={['customer', 'phone']}
        rules={[
          { required: true, message: 'Vui lòng nhập số điện thoại!' },
          { pattern: /\d{8,12}/, message: '8 ~ 12 chữ số' },
        ]}
        help={help}
        extra={
          <Checkbox checked={updateCustomer} onChange={onChange}>
            {UPDATE_CUSTOMER_INFORMATION}
          </Checkbox>
        }
      >
        <Input.Search enterButton={true} onSearch={onSearch} loading={loading} />
      </Item>
    );

    function onChange() {
      setUpdateCustomer(!updateCustomer);
    }

    async function onSearch(value: string) {
      setLoading(true);
      try {
        const customers = (await Axios.get('/api/customers', { params: { phone: value } })).data as Customer[];
        if (customers && Array.isArray(customers) && customers.length) {
          form.setFieldsValue({ ...form.getFieldsValue(), customer: customers[0] });
          setHelp(undefined);
        } else {
          throw new Error(CUSTOMER_NOT_FOUND);
        }
      } catch (error) {
        setHelp(CUSTOMER_NOT_FOUND);
      }
      setLoading(false);
    }
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
        <Input.TextArea />
      </Item>
    );
  }
}
