import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import Register from '../Register';
import router from "../../router.jsx";

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

describe('Register Component', () => {
  it('should render registration form fields', () => {
    render(
      <RouterProvider router={router}>
        <Register />
      </RouterProvider>
    );
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
  });
});
