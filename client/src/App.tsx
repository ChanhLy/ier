import { Layout, Menu, message, PageHeader } from 'antd';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Link, Switch, useHistory, useLocation } from 'react-router-dom';
import './App.css';
import { CreateContractRoute, EditContractRoute, ListContractsRoute } from './contracts/RouteContracts';
import { CreateSampleRoute, EditSampleRoute, ListSamplesRoute } from './samples/RouteSamples';
import { UserContext } from './users/UserContext';
import { CONTRACT, FAILURE, SAMPLE, SUCCESS, Titles } from './utils/constants';
import { URLs } from './utils/urls';

const thisYear = new Date().getFullYear();

Axios.interceptors.response.use(
  (response) => {
    if (response.status === 201) message.success(SUCCESS);
    return response;
  },
  (error) => {
    message.error(FAILURE);
  }
);

function App() {
  return (
    <BrowserRouter>
      <UserContext.Provider value={{ id: '1' }}>
        <Layout className='layout'>
          <Header />
          <Layout>
            <Content />
            <Layout.Footer>IER ©{thisYear} Created by Chanh Ly</Layout.Footer>
          </Layout>
        </Layout>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export function Header() {
  const [defaultSelectedMenuItem, setDefaultSelectedMenuItem] = useState(['']);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes(URLs.CONTRACTS)) {
      setDefaultSelectedMenuItem([URLs.CONTRACTS]);
    } else if (location.pathname.includes(URLs.SAMPLES)) {
      setDefaultSelectedMenuItem([URLs.SAMPLES]);
    }
  }, [location.pathname]);

  return (
    <Layout.Header>
      <Menu theme='dark' mode='horizontal' selectedKeys={defaultSelectedMenuItem}>
        <Menu.Item key={URLs.CONTRACTS}>
          <Link to={URLs.CONTRACTS}>{CONTRACT}</Link>
        </Menu.Item>
        <Menu.Item key={URLs.SAMPLES}>
          <Link to={URLs.SAMPLES}>{SAMPLE}</Link>
        </Menu.Item>
      </Menu>
    </Layout.Header>
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
        </Switch>
      </div>
    </Layout.Content>
  );
}

export default App;
