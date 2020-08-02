import { render } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App, { Header } from './App';

test('renders IER text', () => {
  const { getByText } = render(<App />);
  const ierElement = getByText(/IER/i);
  expect(ierElement).toBeInTheDocument();
});

test('render header menu with contracts and samples', () => {
  const { getByText } = render(
    <BrowserRouter>
      {' '}
      <Header />
    </BrowserRouter>
  );
  const contractsMenuItem = getByText(/Hợp đồng/i);
  const samplesMenuItem = getByText(/Mẫu/i);
  expect(contractsMenuItem).toBeInTheDocument();
  expect(samplesMenuItem).toBeInTheDocument();
});
