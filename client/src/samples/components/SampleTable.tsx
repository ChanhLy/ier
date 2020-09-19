import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { Sample } from '../samples.model';

export function SampleTable() {
  return <Table columns={columns}></Table>;
}
const columns: ColumnsType<Sample> = [];
