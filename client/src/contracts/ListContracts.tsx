import { Button, Col, Row } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { CREATE_NEW_CONTRACT } from '../utils/constants';
import { URLS } from '../utils/urls';

export function ListContracts() {
  return (
    <Col>
      <Row>
        <Button>
          <Link to={URLS.CONTRACTS_CREATE}>{CREATE_NEW_CONTRACT}</Link>
        </Button>
      </Row>
      ListContracts
    </Col>
  );
}
