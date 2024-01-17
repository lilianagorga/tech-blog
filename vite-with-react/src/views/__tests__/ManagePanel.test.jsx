import { describe, it, expect, vi } from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import ManagePanel from '../ManagePanel';
import { useStateContext } from '../../contexts/ContextProvider';
import axiosClient from "../../axios.js";

vi.mock('../../contexts/ContextProvider', () => ({
  useStateContext: vi.fn( () => ({
    showToast: vi.fn(),
    userPermissions: [],
    setUserPermissions: vi.fn(),
    userRoles: [],
    setUserRoles: vi.fn(),
    currentUser: {},
  })),
}));

let isAdminResponse = true;

vi.mock("../../axios.js", () => ({
  default: {
    get: vi.fn((url) => {
      if (url === '/manage-panels') {
        return Promise.resolve({
          data: {
            users: [
              { id: 1, email: 'user@example.com', roles: [{ name: 'User' }], permissions: [{ name: 'read' }] },
            ],
            permissions: [
              { name: 'read' },
              { name: 'write' },
            ],
            roles: [
              { name: 'User' },
              { name: 'Admin' },
            ],
            isAdmin: true
          }
        });
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

describe('ManagePanel Component', () => {
  it('should render correctly', () => {
    const router = createMemoryRouter([{ path: '/', element: <ManagePanel /> }]);
    render(
        <RouterProvider router={router}>
          <ManagePanel />
        </RouterProvider>
    )
  });
});

describe('ManagePanel Component', () => {
  it('should make an API call to fetch users, roles, and permissions', async () => {
    const router = createMemoryRouter([{ path: '/', element: <ManagePanel /> }]);
    render(
        <RouterProvider router={router}>
          <ManagePanel />
        </RouterProvider>
    );
    await waitFor(() => {
      expect(axiosClient.get).toHaveBeenCalledWith('/manage-panels');
    });
  });

  it('should not make unnecessary API calls when there are no data changes', async () => {
    const router = createMemoryRouter([{ path: '/', element: <ManagePanel /> }]);
    render(
        <RouterProvider router={router}>
          <ManagePanel />
        </RouterProvider>
    );
    await waitFor(() => {
      expect(axiosClient.get).toHaveBeenCalledTimes(1);
    });
  });
});

