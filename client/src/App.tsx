import { Layout, Menu, message } from 'antd';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Link, Redirect, useLocation } from 'react-router-dom';
import './App.css';
import { ContractsRoutes } from './contracts';
import { ExperimentRoutes } from './experiments';
import { SampleRoutes } from './samples';
import { UserContext } from './users/UserContext';
import { CONTRACT, EXPERIMENT, FAILURE, SAMPLE } from './utils/constants';
import { URLs } from './utils/urls';

const source = Axios.CancelToken.source();

export function cancelRequest() {
  source.cancel('Cancel');
}

Axios.interceptors.request.use((config) => {
  config.cancelToken = source.token;
  return config;
});

Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (Axios.isCancel(error)) {
      return;
    }
    console.error(error);
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
            <Footer />
          </Layout>
        </Layout>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

function Footer() {
  const thisYear = new Date().getFullYear();
  return <Layout.Footer>IER ©{thisYear} Created by Chanh Ly</Layout.Footer>;
}

export function Header() {
  const [defaultSelectedMenuItem, setDefaultSelectedMenuItem] = useState(['']);

  const location = useLocation();

  useEffect(() => {
    setDefaultSelectedMenuItem([location.pathname]);
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
        <Menu.Item key={URLs.EXPERIMENTS}>
          <Link to={URLs.EXPERIMENTS}>{EXPERIMENT}</Link>
        </Menu.Item>
      </Menu>
    </Layout.Header>
  );
}

function Content() {
  return (
    <Layout.Content>
      <ContractsRoutes />
      <SampleRoutes />
      <ExperimentRoutes />
      <Redirect to={URLs.CONTRACTS} />
    </Layout.Content>
  );
}

export default App;
