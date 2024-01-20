import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import Home from '../Home.jsx';

describe('Home Component', () => {
  it('should render correctly', () => {
    const router = createMemoryRouter([{ path: '/', element: <Home /> }]);
    render(
      <RouterProvider router={router}>
        <Home />
      </RouterProvider>
    );

  });
});

describe('Home Component', () => {
  it('should display the heading 1', async() => {
    const router = createMemoryRouter([{ path: '/', element: <Home /> }]);
    render(
      <RouterProvider router={router}>
        <Home />
      </RouterProvider>
    );
    const viewPostsButton = await screen.findByText('View Posts');
    expect(viewPostsButton).toBeInTheDocument();
  });
});

describe('Home Component', () => {
  it('renders the content', async() => {
    const mockData = {
      posts: [{ id: 1, title: "Example post" }]
    };
    const router = createMemoryRouter([{ path: '/', element: <Home /> }]);
    render(<RouterProvider router={router}><Home data={mockData} /></RouterProvider>);
    const heading = await screen.findByText(/Comments/i);
    expect(heading).toBeInTheDocument();
  });
});
