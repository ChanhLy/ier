import { Button, Col, Row, Table } from 'antd';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CREATE_NEW_CONTRACT } from '../utils/constants';
import { URLS } from '../utils/urls';
import { contractColumns } from './components/contractColumns';

export function ListContracts() {
  const [contracts, setContracts] = useState([]);
  useEffect(() => {
    Axios.get('/api/contracts').then((response) => {
      setContracts(response.data);
    });
  }, []);

  return (
    <Col>
      <Row>
        <Button>
          <Link to={URLS.CONTRACTS_CREATE}>{CREATE_NEW_CONTRACT}</Link>
        </Button>
      </Row>
      <br />
      <Row>
        <Table columns={contractColumns} dataSource={contracts} rowKey='_id' bordered={true}></Table>
      </Row>
    </Col>
  );
}
