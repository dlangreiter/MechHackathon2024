// src/App.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders ANT61 Beacon Visualization header', () => {
  render(<App />);
  const headerElement = screen.getByText(/ANT61 Beacon Visualization/i);
  expect(headerElement).toBeInTheDocument();
});