import { Button, PageHeader, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import { CREATE_NEW_CONTRACT, LIST_CONTRACT } from '../../utils/constants';
import { URLs } from '../../utils/urls';
import { ContractsTable } from '../components/ContractsTable';
import { Contract } from '../contracts.model';
import { getContracts } from '../contracts.service';

const socket = io();

export const ListContractsPage = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [contractsCsv, setContractsCsv] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    socket.on('Refresh_Contracts', function () {
      getContracts().then((value) => {
        setContracts(value);
      });
    });
    return () => {
      socket.off('Refresh_Contracts');
    };
  }, []);

  useEffect(() => {
    if (loading) {
      getContracts().then((value) => {
        setLoading(false);
        setContracts(value);
      });
    }
  }, [loading]);

  // useEffect(() => {
  //   const csv = contracts.map((contract: Contract) => {
  //     const { customerId, customer, resultReturnDate, sampleReceivedDate, samples, samplingLocation } = contract;
  //     return { [CUSTOMER_ID]: customerId, [PHONE_NUMBER]: customer.phone };
  //   });
  // }, [contracts]);

  return (
    <div>
      <PageHeader title={LIST_CONTRACT}></PageHeader>
      <Row className='content' justify='space-between'>
        <Button type='primary'>
          <Link to={URLs.CONTRACTS_CREATE}>{CREATE_NEW_CONTRACT}</Link>
        </Button>
        <Button>{/* <CSVLink data={[]}>Sổ nhận mẫu</CSVLink> */}</Button>
      </Row>
      <ContractsTable contracts={contracts} loading={loading} />
    </div>
  );

  function toContractCSV() {}
};
