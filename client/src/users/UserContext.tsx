import { createContext } from 'react';

export const UserContext = createContext({ user: { username: '' }, setUser: (user: { username: '' }) => {} });
