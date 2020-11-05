import { Button, Form, Input } from 'antd';
import { Store } from 'antd/lib/form/interface';
import Axios from 'axios';
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from './UserContext';

const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 10, span: 16 },
};

export function LoginPage() {
  const history = useHistory();
  const { setUser } = useContext(UserContext);

  async function onFinish(values: Store) {
    Axios.post('/api/login', values).then((response) => {
      if (response?.status === 200) {
        setUser({ username: values.username });
        localStorage.setItem('user', JSON.stringify({ username: values.username }));
        history.push('/');
      }
    });
  }

  function onFinishFailed(errorInfo: any) {
    console.log('Failed:', errorInfo);
  }

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        flexGrow: 1,
        alignContent: 'center',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center',
      }}
    >
      <Form
        {...layout}
        name='basic'
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label='Tên đăng nhập'
          name='username'
          rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label='Mật khẩu' name='password' rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
