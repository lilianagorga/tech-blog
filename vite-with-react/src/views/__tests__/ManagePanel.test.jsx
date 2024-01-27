import { describe, it, expect, vi } from 'vitest';
import {render, screen, waitFor, fireEvent} from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import ManagePanel from '../ManagePanel';
import { useStateContext } from '../../contexts/ContextProvider';
import axiosClient from "../../axios.js";

const selectedUser = {
  id: 1,
  email: 'admin@techBlog.com',
  roles: [{ name: 'Admin' }],
  permissions: []
};
const userRoleNames = [
  { name: 'User', disabled: false },
  { name: 'Admin', disabled: false },
];
vi.mock('../../contexts/ContextProvider', () => ({
  useStateContext: vi.fn(() => ({
    showToast: vi.fn(),
    permissions: ['managePanel', 'managePosts', 'manageCategories', 'manageComments'],
    roles: ['Admin', 'Writer', 'Moderator'],
    userRoleNames: userRoleNames,
    setUserRoleNames: vi.fn(),
    currentUser: { isAdmin: true },
    setSelectedUser: vi.fn(),
    setRoleToAdd: vi.fn(),
    selectedUser: selectedUser,
    })),
}));
vi.mock("../../axios.js", () => ({
  default: {
    get: vi.fn((url) => {
      if (url === '/manage-panels') {
        return Promise.resolve({
          data: {
            users: [
              { id: 1, email: "admin@techBlog.com", roles: [{ name: 'Admin' }], permissions: [] },
              { id: 2, email: "user@email.com", roles: [{ name: 'User' }], permissions: [] },
            ],
            permissions: ['managePanel', 'managePosts', 'manageCategories', 'manageComments'],
            roles: ['Admin', 'Writer', 'Moderator'],
            isAdmin: true
          }
        });
      }
    }),

    post: vi.fn().mockImplementation((url, payload) =>{
      if (url === '/roles') {
        if (payload && payload.name) {
          return Promise.resolve({ status: 201, data: { name: payload.name } });
        } else {
          return Promise.reject(new Error("Invalid payload"));
        }
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

    const context = useStateContext();
    console.log('Context in test:', context);

    await waitFor(() => {
      expect(axiosClient.get).toHaveBeenCalledWith('/manage-panels');
    });
  });
});

describe('ManagePanel Component', () => {
  it('should display loading message before data is loaded', async () => {
    const router = createMemoryRouter([{ path: '/', element: <ManagePanel /> }]);
    render(
      <RouterProvider router={router}>
        <ManagePanel />
      </RouterProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => expect(axiosClient.get).toHaveBeenCalledWith('/manage-panels'));
  });

  it('should display user and role data after loading', async () => {
    const router = createMemoryRouter([{ path: '/', element: <ManagePanel /> }]);
    render(
      <RouterProvider router={router}>
        <ManagePanel />
      </RouterProvider>
    );

    screen.debug();
    await waitFor(() => {
      expect(screen.getByText('admin@techBlog.com')).toBeInTheDocument();
      expect(screen.getByText('Admin')).toBeInTheDocument();
    });
  });
});

describe('ManagePanel Component', () =>{

  it('should open and close the PermissionsModal correctly', async ()=>{
    const router = createMemoryRouter([{path: '/', element: <ManagePanel/>}]);
    render(
      <RouterProvider router={router}>
        <ManagePanel/>
      </RouterProvider>
    );
    const permissionsButton = await screen.findByTestId('open-permissions-modal');
    expect(permissionsButton).toBeInTheDocument();
    fireEvent.click(permissionsButton);
    await waitFor(()=>{
      const permissionsPanel = screen.getByTestId('permissions-panel');
      expect(permissionsPanel).toBeInTheDocument();
    });
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);
    await waitFor(()=>{
      expect(screen.queryByTestId('permissions-panel')).not.toBeInTheDocument();
    });
  });

  it('should create role correctly when the create button is clicked', async ()=>{
    const router = createMemoryRouter([{path: '/', element: <ManagePanel/>}]);
    render(
      <RouterProvider router={router}>
        <ManagePanel/>
      </RouterProvider>
    );

    const rolesButton = await screen.findByTestId('open-roles-modal');
    fireEvent.click(rolesButton);
    const roleNameInput = screen.getByPlaceholderText('enter a name');
    fireEvent.change(roleNameInput, {target: {value: 'New Role'}});
    const createRoleButton = screen.getByText('Create Role');
    fireEvent.click(createRoleButton);
    await waitFor(()=>{
      expect(axiosClient.post).toHaveBeenCalledWith('/roles', {name: 'New Role'});
    });
  });
});
