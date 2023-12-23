import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import Dashboard from '../Dashboard';

describe('Dashboard Component', () => {
  it('should render correctly', () => {
    const router = createMemoryRouter([{ path: '/', element: <Dashboard /> }]);
    render(
      <RouterProvider router={router}>
        <Dashboard />
      </RouterProvider>
    );
  });
});
