import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import {
  AMOUNT,
  METHOD,
  NOTE,
  SAMPLE_DESCRIPTION,
  SAMPLE_SYMBOL,
  SAMPLE_TYPE,
  SAMPLING_LOCATION,
  TARGET,
  UNIT,
} from '../../utils/constants';
import { Sample } from '../samples.model';

export function CreateSamplesTable() {
  return <Table columns={columns} bordered></Table>;
}
const columns: ColumnsType<Sample> = [
  { title: SAMPLE_SYMBOL },
  { title: SAMPLING_LOCATION },
  { title: SAMPLE_DESCRIPTION },
  { title: AMOUNT },
  { title: UNIT },
  { title: SAMPLE_TYPE },
  { title: TARGET },
  { title: METHOD },
  { title: NOTE },
];
