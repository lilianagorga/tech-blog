import { describe, it, expect } from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import Home from '../Home.jsx';
import axiosClient from "../../axios.js";

vi.mock("../../axios.js", () => ({
  __esModule: true,
  default: {
    get: vi.fn((url) => {
      switch (url) {
        case '/categories':
          return Promise.resolve({
            data: [
              { id: 24, title: 'Frontend' },
              { id: 25, title: 'Backend' }
            ]
          });
        default:
          return Promise.reject(new Error("Not found"));
      }
    }),
    interceptors: {
      request: {
        use: vi.fn().mockImplementation((config) => {
          return config;
        })
      },
      response: {
        use: vi.fn().mockImplementation((success, error) => {
          return [success, error];
        })
      }
    }
  }
}));


describe('Home Component', () => {
  it('should render correctly', () => {
    const router = createMemoryRouter([{ path: '/', element: <Home /> }]);
    render(
      <RouterProvider router={router}>
        <Home />
      </RouterProvider>
    );

  });

  it('should display loading message initially and then load data', async () => {
    const router = createMemoryRouter([{ path: '/', element: <Home /> }]);
    render(
      <RouterProvider router={router}>
        <Home />
      </RouterProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(axiosClient.get).toHaveBeenCalledWith('/categories');
    });

    await waitFor(() => {
      expect(screen.getByTestId('category-Frontend')).toBeInTheDocument();
    });
  });
});





