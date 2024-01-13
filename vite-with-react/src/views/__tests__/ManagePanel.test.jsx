import { describe, it, expect, vi } from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import ManagePanel from '../ManagePanel';
import { useStateContext } from '../../contexts/ContextProvider';
import axiosClient from "../../axios.js";
import axiosMock from "./mocks/axiosMock";

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
  default: vi.importActual('../../mocks/axiosMock').default,
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
  it('should render the content', async () => {
    const mockData = {
      posts: [{ id: 1, title: "Example post" }]
    };
    const router = createMemoryRouter([{ path: '/', element: <ManagePanel /> }]);
    render(
        <RouterProvider router={router}>
          <ManagePanel data={mockData} />
        </RouterProvider>
    );
    const span = await screen.findByText(/Comments/i);
    expect(span).toBeInTheDocument();
  });
})

describe('ManagePanel Component', () => {
  it('should display admin links for admin users', async () => {
    isAdminResponse = true;
    const router = createMemoryRouter([{ path: '/', element: <ManagePanel /> }]);
    render(
        <RouterProvider router={router}>
          <ManagePanel />
        </RouterProvider>
    );
    await waitFor(() => expect(screen.queryByText(/Add Permission/i)).toBeInTheDocument());
  });

  it('should not display admin links for non-admin users', async () => {
    isAdminResponse = false;
    const router = createMemoryRouter([{ path: '/', element: <ManagePanel /> }]);
    render(
        <RouterProvider router={router}>
          <ManagePanel />
        </RouterProvider>
    );
    await waitFor(() => expect(screen.queryByText(/Add Permission/i)).not.toBeInTheDocument());
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
      expect(axiosClient.get).toHaveBeenCalledWith('/users/manage-panels');
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

