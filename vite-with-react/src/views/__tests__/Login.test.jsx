import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import Login from '../Login';
import router from "../../router.jsx";

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

describe('Login Component', () =>{
  it('should render email and password fields', ()=>{
    render(
      <RouterProvider router={router}>
        <Login />
      </RouterProvider>
    );
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });
});
