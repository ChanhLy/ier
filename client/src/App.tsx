import { Button, Layout, Menu, message, Row } from 'antd';
import Axios from 'axios';
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { Link, Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import './App.css';
import { PrivateRoute } from './components/PrivateRoute';
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

const localStorageUser = JSON.parse(localStorage.getItem('user') || '{}') || { username: '', role: '' };

function App() {
  const [user, setUser] = useState<User>(localStorageUser);
  const history = useHistory();

  useEffect(() => {
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
        switch (error.response.status) {
          case 401:
            history.push('/login');
            break;

          default:
            message.error(FAILURE);
            break;
        }
      }
    );
  }, [history]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Switch>
        <Route exact path='/login'>
          <LoginPage />
        </Route>
        <PrivateRoute>
          <Layout className='layout'>
            <Header />
            <Layout>
              <Content />
              <Footer />
            </Layout>
          </Layout>
        </PrivateRoute>
      </Switch>
    </UserContext.Provider>
  );
}

function Footer() {
  const thisYear = new Date().getFullYear();
  return <Layout.Footer>IER ©{thisYear} Created by Chanh Ly</Layout.Footer>;
}

interface PrivateMenuItemProps {
  roles: string[];
  children: ReactElement;
}
function PrivateMenuItem(props: PrivateMenuItemProps) {
  const { user } = useContext(UserContext);
  if (props.roles.includes(user.role)) {
    return props.children;
  }
  return null;
}

export function Header() {
  const location = useLocation();

  return (
    <Layout.Header>
      <Row justify='space-between' align='middle'>
        <Menu theme='dark' mode='horizontal' selectedKeys={[location.pathname]}>
          <Menu.Item key={URLs.CONTRACTS}>
            <PrivateMenuItem roles={['admin']}>
              <Link to={URLs.CONTRACTS}>{CONTRACT}</Link>
            </PrivateMenuItem>
          </Menu.Item>

          <Menu.Item key={URLs.SAMPLES}>
            <PrivateMenuItem roles={['admin']}>
              <Link to={URLs.SAMPLES}>{SAMPLE}</Link>
            </PrivateMenuItem>
          </Menu.Item>

          <Menu.Item key={URLs.EXPERIMENTS}>
            <PrivateMenuItem roles={['admin', 'lab']}>
              <Link to={URLs.EXPERIMENTS}>{EXPERIMENT}</Link>
            </PrivateMenuItem>
          </Menu.Item>
        </Menu>
        <LogoutButton />
      </Row>
    </Layout.Header>
  );
}

function LogoutButton() {
  const { setUser } = useContext(UserContext);
  const history = useHistory();

  return (
    <Button danger onClick={logout} size='middle'>
      Đăng xuất
    </Button>
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
