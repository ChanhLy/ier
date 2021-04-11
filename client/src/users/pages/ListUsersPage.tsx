import { PageHeader, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import Axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { LIST_USER } from '../../utils/constants';
import { User } from '../User';

export function ListUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const source = Axios.CancelToken.source();

    Axios.get('/api/users', { cancelToken: source.token })
      .then((res: AxiosResponse<User[]>) => {
        res.data && setUsers(res.data);
      })
      .finally(() => setLoading(false));

    return () => {
      source.cancel();
    };
  }, []);

  return (
    <>
      <PageHeader title={LIST_USER}></PageHeader>
      <div className='content'>
        <Table dataSource={users} loading={loading} columns={userColumns} />
      </div>
    </>
  );
}

const userColumns: ColumnsType<User> = [
  {
    title: 'Tên tài khoản',
    dataIndex: 'username',
  },
  {
    title: 'Vai trò',
    dataIndex: 'role',
  },
];
