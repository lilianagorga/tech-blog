import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import Register from '../Register';

describe('Register Component', () => {
  it('should render correctly', () => {
    const router = createMemoryRouter([{ path: '/', element: <Register /> }]);
    render(
      <RouterProvider router={router}>
        <Register />
      </RouterProvider>
    );
  });
});
