import { PageHeader, Skeleton } from 'antd';
import Axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { CREATE_NEW_CONTRACT_TITLE, EDITING_CONTRACT_TITLE, LIST_CONTRACT } from '../utils/constants';
import { APIs } from '../utils/urls';
import { Contract } from './Contract';
import { CreateContract } from './CreateContract';
import { EditContract } from './EditContract';
import { ListContracts } from './ListContracts';

export const ListContractsPage = () => {
  return (
    <>
      <PageHeader title={LIST_CONTRACT}></PageHeader>
      <div className='content'>
        <ListContracts />
      </div>
    </>
  );
};

export const CreateContractPage = () => {
  const history = useHistory();
  return (
    <>
      <PageHeader title={CREATE_NEW_CONTRACT_TITLE} onBack={() => history.goBack()}></PageHeader>
      <div className='content'>
        <CreateContract />
      </div>
    </>
  );
};

export const EditContractPage = () => {
  const [contract, setContract] = useState<Contract>();
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    Axios.get(APIs.CONTRACTS + '/' + id).then((response) => {
      const contract = response.data as Contract;
      contract.sampleReceivedDate = dayjs(contract.sampleReceivedDate);
      contract.resultReturnDate = dayjs(contract.resultReturnDate);
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
