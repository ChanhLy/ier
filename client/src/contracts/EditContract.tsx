import { Store } from 'antd/lib/form/interface';
import Axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { APIs } from '../utils/urls';
import { ContractForm } from './components/ContractForm';
import { Contract } from './Contract';

export function EditContract() {
  const [contract, setContract] = useState();
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

  return <ContractForm value={contract} onFinish={onFinish} />;

  async function onFinish(value: Store) {
    await Axios.put(APIs.CONTRACTS + '/' + id, value);
    history.goBack();
  }
}
