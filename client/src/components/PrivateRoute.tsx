import React, { ReactElement, useContext } from 'react';
import { Redirect } from 'react-router';
import { UserContext } from '../users/UserContext';

interface PrivateRouteProps {
  children: ReactElement;
}
export function PrivateRoute(props: PrivateRouteProps) {
  const { user } = useContext(UserContext);

  if (!user) {
    return <Redirect to='/login' />;
  }

  return props.children;
}
