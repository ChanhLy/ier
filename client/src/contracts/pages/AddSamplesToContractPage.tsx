import { PageHeader } from 'antd';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { ADD_SAMPLES_TO_CONTRACT } from '../../utils/constants';

export function AddSamplesToContractPage() {
  const history = useHistory();
  return (
    <>
      <PageHeader title={ADD_SAMPLES_TO_CONTRACT} onBack={history.goBack}></PageHeader>
    </>
  );
}
