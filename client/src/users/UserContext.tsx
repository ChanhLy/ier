import { createContext } from 'react';

export const UserContext = createContext({
  user: { username: '', role: '' },
  setUser: (user: { username: ''; role: '' }) => {},
});
