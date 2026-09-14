import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '../test/utils';
import EmployeeListPage from './EmployeeListPage';
import * as api from '../api/employees';
import type { Employee } from '../types/employee';

vi.mock('../api/employees');

const employee: Employee = {
  id: 1,
  firstName: 'John',
  middleName: null,
  lastName: 'Smith',
  email: 'john.smith@email.com',
  mobileNumber: '+61412345678',
  address: '123 Example St, Sydney NSW 2000',
  contractType: 'PERMANENT',
  startDate: '2021-07-28',
  finishDate: null,
  ongoing: true,
  employmentBasis: 'FULL_TIME',
  hoursPerWeek: 38,
};

describe('EmployeeListPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('shows a loading message before the employees arrive', () => {
    vi.mocked(api.getEmployees).mockReturnValue(new Promise(() => {}));

    renderWithProviders(<EmployeeListPage />);

    expect(screen.getByText(/loading employees/i)).toBeInTheDocument();
  });

  it('renders each employee returned by the API', async () => {
    vi.mocked(api.getEmployees).mockResolvedValue([employee]);

    renderWithProviders(<EmployeeListPage />);

    expect(await screen.findByText('John Smith')).toBeInTheDocument();
    expect(screen.getByText('john.smith@email.com')).toBeInTheDocument();
  });

  it('shows a message when there are no employees', async () => {
    vi.mocked(api.getEmployees).mockResolvedValue([]);

    renderWithProviders(<EmployeeListPage />);

    expect(await screen.findByText(/no employees yet/i)).toBeInTheDocument();
  });

  it('shows an error message when the request fails', async () => {
    vi.mocked(api.getEmployees).mockRejectedValue(new Error('Network down'));

    renderWithProviders(<EmployeeListPage />);

    expect(await screen.findByText(/network down/i)).toBeInTheDocument();
  });

  it('deletes an employee when Remove is confirmed', async () => {
    vi.mocked(api.getEmployees).mockResolvedValue([employee]);
    vi.mocked(api.deleteEmployee).mockResolvedValue(undefined);
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    renderWithProviders(<EmployeeListPage />);

    await screen.findByText('John Smith');
    await userEvent.click(screen.getByRole('button', { name: /remove/i }));

    await waitFor(() => {
      expect(api.deleteEmployee).toHaveBeenCalledWith(1, expect.anything());
    });
  });

  it('does not delete when the confirmation is cancelled', async () => {
    vi.mocked(api.getEmployees).mockResolvedValue([employee]);
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    renderWithProviders(<EmployeeListPage />);

    await screen.findByText('John Smith');
    await userEvent.click(screen.getByRole('button', { name: /remove/i }));

    expect(api.deleteEmployee).not.toHaveBeenCalled();
  });
});