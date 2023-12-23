import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import Login from '../Login';

describe('Login Component', () => {
  it('should render correctly', () => {
    const router = createMemoryRouter([{ path: '/', element: <Login /> }]);
    render(
      <RouterProvider router={router}>
        <Login />
      </RouterProvider>
    );
  });
});


