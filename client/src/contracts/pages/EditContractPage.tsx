import { PageHeader, Skeleton } from 'antd';
import Axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { EDITING_CONTRACT_TITLE } from '../../utils/constants';
import { APIs } from '../../utils/urls';
import { EditContract } from '../components/EditContract';
import { Contract } from '../contracts.model';

export const EditContractPage = () => {
  const [contract, setContract] = useState<Contract>();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  useEffect(() => {
    Axios.get(APIs.CONTRACTS + '/' + id).then((response) => {
      if (!response) {
        return;
      }
      const data = response.data as Contract;
      data.sampleReceivedDate = dayjs(data.sampleReceivedDate);
      data.resultReturnDate = dayjs(data.resultReturnDate);
      setContract(response.data);
    });
  }, [id]);

  if (!contract) {
    return <Skeleton loading={true} />;
  }

  return (
    <>
      <PageHeader title={EDITING_CONTRACT_TITLE} onBack={() => history.goBack()}></PageHeader>
      <div className='content'>
        <EditContract contract={contract} />
      </div>
    </>
  );
};
