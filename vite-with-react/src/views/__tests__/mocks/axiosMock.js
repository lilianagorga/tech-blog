import {vi} from "vitest";

const axiosMock = {
  get: vi.fn((url) => {
    if (url === '/users/manage-panels') {
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

export default axiosMock;
