import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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

describe('Dashboard Component', () => {
  it('should display the heading 1', async() => {
    const router = createMemoryRouter([{ path: '/', element: <Dashboard /> }]);
    render(
      <RouterProvider router={router}>
        <Dashboard />
      </RouterProvider>
    );
    const viewPostsButton = await screen.findByText('View Posts');
    expect(viewPostsButton).toBeInTheDocument();
  });
});

describe('Dashboard Component', () => {
  it('renders the content', async() => {
    const mockData = {
      posts: [{ id: 1, title: "Example post" }]
    };
    const router = createMemoryRouter([{ path: '/', element: <Dashboard /> }]);
    render(<RouterProvider router={router}><Dashboard data={mockData} /></RouterProvider>);
    const heading = await screen.findByText(/Hello/i);
    expect(heading).toBeInTheDocument();
  });
});
