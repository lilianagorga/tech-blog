import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../Login';

describe('Login Component', () => {
  it('renders login form with email and password fields', () => {
    render(<Login />);

    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });


  it('updates email and password fields on user input', () => {
    render(<Login />);

    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Secret123!' } });

    expect(emailInput.value).toBe('test@test.com');
    expect(passwordInput.value).toBe('Secret123!');
  });
});

