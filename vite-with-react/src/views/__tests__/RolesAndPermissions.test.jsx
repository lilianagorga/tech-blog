import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddPermission from "../AddPermission.jsx";
import AddRole from "../AddRole.jsx";
import CreatePermission from "../CreatePermission.jsx";
import CreateRole from "../CreateRole.jsx";
import DeletePermission from "../DeletePermission.jsx";
import DeleteRole from "../DeleteRole.jsx";
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import axiosClient from "../../axios.js";
import axiosMock from "./mocks/axiosMock";

vi.mock("../../axios.js", () => ({
  default: axiosMock
}));

describe('AddPermission Component', () => {
  beforeEach(() => {
    vi.mock('axiosClient');
    const router = createMemoryRouter([{ path: '/', element: <AddPermission /> }]);
    render(
      <RouterProvider router={router}>
        <AddPermission />
      </RouterProvider>
    )
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render AddPermission component correctly', async () => {
    // Logica per il rendering e la verifica del componente
  });

  it('should handle form submission correctly for successful API call', async () => {
    // Mock della risposta di successo di axiosClient
    // Logica per il test dell'invio del form e della logica di successo
  });

  it('should handle form submission correctly for failed API call', async () => {
    // Mock della risposta di errore di axiosClient
    // Logica per il test dell'invio del form e della logica di errore
  });

  // Altri test che ritieni necessari
});
