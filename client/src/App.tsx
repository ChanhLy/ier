import { Layout, Menu, PageHeader } from 'antd';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Link, Redirect, Switch, useHistory, useLocation } from 'react-router-dom';
import './App.css';
import { CreateContractRoute, EditContractRoute, ListContractsRoute } from './contracts/RouteContracts';
import { CreateSampleRoute, EditSampleRoute, ListSamplesRoute } from './samples/RouteSamples';
import { CONTRACT, CREATE_NEW_CONTRACT_TITLE, SAMPLE } from './utils/constants';
import { URLS } from './utils/urls';

const thisYear = new Date().getFullYear();

function App() {
  return (
    <BrowserRouter>
      <Layout className='layout'>
        <Sider />
        <Layout>
          <Content />
          <Layout.Footer>IER ©{thisYear} Created by Chanh Ly</Layout.Footer>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
}

export function Sider() {
  const [defaultSelectedMenuItem, setDefaultSelectedMenuItem] = useState(['']);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes(URLS.CONTRACTS)) {
      setDefaultSelectedMenuItem([URLS.CONTRACTS]);
    } else if (location.pathname.includes(URLS.SAMPLES)) {
      setDefaultSelectedMenuItem([URLS.SAMPLES]);
    }
  }, [location.pathname]);

  return (
    <Layout.Sider>
      <div className='logo' />
      <Menu theme='dark' selectedKeys={defaultSelectedMenuItem}>
        <Menu.Item key={URLS.CONTRACTS}>
          <Link to={URLS.CONTRACTS}>{CONTRACT}</Link>
        </Menu.Item>
        <Menu.Item key={URLS.SAMPLES}>
          <Link to={URLS.SAMPLES}>{SAMPLE}</Link>
        </Menu.Item>
      </Menu>
    </Layout.Sider>
  );
}

function Content() {
  const location = useLocation();
  const history = useHistory();
  const [title, setTitle] = useState('dsa');
  const [onBack, setOnBack] = useState<((e: React.MouseEvent) => void) | undefined>();

  useEffect(() => {
    setTitle(Titles.get(location.pathname) || 'Welcome');
    if (location.pathname.match(/^\/.*\//)) {
      setOnBack((e: React.MouseEvent) => history.goBack);
    } else {
      setOnBack(undefined);
    }
  }, [location, history.goBack]);

  return (
    <Layout.Content>
      <PageHeader title={title} onBack={onBack}></PageHeader>
      <div style={{ padding: 24, backgroundColor: 'white' }}>
        <Switch>
          {CreateContractRoute}
          {ListContractsRoute}
          {EditContractRoute}
          {CreateSampleRoute}
          {EditSampleRoute}
          {ListSamplesRoute}
          <Redirect to={'/'} />
        </Switch>
      </div>
    </Layout.Content>
  );
}

export default App;

const Titles = new Map();
Titles.set(URLS.CONTRACTS_CREATE, CREATE_NEW_CONTRACT_TITLE);
