import { Button, Layout, Menu, message, Row } from 'antd';
import Axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Link, Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import './App.css';
import { CreateContractPage } from './contracts/pages/CreateContractPage';
import { EditContractPage } from './contracts/pages/EditContractPage';
import { ListContractsPage } from './contracts/pages/ListContractsPage';
import { ListExperimentsPage } from './experiments/pages/ListExperimentsPage';
import { ListSamplesPage } from './samples';
import { EditSamplePage } from './samples/pages/EditSamplePage';
import { LoginPage } from './users/LoginPage';
import { User } from './users/User';
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
  const [user, setUser] = useState<User>(
    JSON.parse(localStorage.getItem('user') || '{}') || { username: '', role: '' }
  );

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ user, setUser }}>
        <Switch>
          <Route exact path='/login'>
            <LoginPage />
          </Route>
          <Layout className='layout'>
            <Header />
            <Layout>
              <Content />
              <Footer />
            </Layout>
          </Layout>
        </Switch>
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

  const { user, setUser } = useContext(UserContext);
  console.log(user);

  const location = useLocation();

  useEffect(() => {
    setDefaultSelectedMenuItem([location.pathname]);
  }, [location.pathname]);

  const history = useHistory();

  return (
    <Layout.Header>
      <Row justify='space-between' align='middle'>
        <Menu theme='dark' mode='horizontal' selectedKeys={defaultSelectedMenuItem}>
          {['admin'].includes(user.role) && (
            <Menu.Item key={URLs.CONTRACTS}>
              <Link to={URLs.CONTRACTS}>{CONTRACT}</Link>
            </Menu.Item>
          )}
          {['admin'].includes(user.role) && (
            <Menu.Item key={URLs.SAMPLES}>
              <Link to={URLs.SAMPLES}>{SAMPLE}</Link>
            </Menu.Item>
          )}
          {['admin', 'lab'].includes(user.role) && (
            <Menu.Item key={URLs.EXPERIMENTS}>
              <Link to={URLs.EXPERIMENTS}>{EXPERIMENT}</Link>
            </Menu.Item>
          )}
        </Menu>
        <Button danger onClick={logout} size='middle'>
          Đăng xuất
        </Button>
      </Row>
    </Layout.Header>
  );
  function logout() {
    localStorage.clear();
    setUser({ username: '', role: '' });
    history.push('/login');
  }
}

function Content() {
  const { user } = useContext(UserContext);
  return (
    <Layout.Content>
      {!user.username && <Redirect to='/login' />}
      <Switch>
        {['admin'].includes(user.role) && (
          <Route exact={true} path={URLs.CONTRACTS_CREATE}>
            <CreateContractPage />
          </Route>
        )}
        {['admin'].includes(user.role) && (
          <Route exact={true} path={URLs.CONTRACTS}>
            <ListContractsPage />
          </Route>
        )}
        {['admin'].includes(user.role) && (
          <Route path={URLs.CONTRACTS_ID}>
            <EditContractPage />
          </Route>
        )}
        {['admin'].includes(user.role) && (
          <Route exact={true} path={URLs.SAMPLES}>
            <ListSamplesPage />
          </Route>
        )}
        {['admin'].includes(user.role) && (
          <Route path={URLs.SAMPLES_ID}>
            <EditSamplePage />
          </Route>
        )}
        {['admin', 'lab'].includes(user.role) && (
          <Route exact={true} path={URLs.EXPERIMENTS}>
            <ListExperimentsPage />
          </Route>
        )}
      </Switch>
    </Layout.Content>
  );
}

export default App;
