import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '../test/utils';
import EmployeeFormPage from './EmployeeFormPage';
import * as api from '../api/employees';

vi.mock('../api/employees');

async function fillValidForm() {
  await userEvent.type(screen.getByLabelText(/^first name/i), 'Tessa');
  await userEvent.type(screen.getByLabelText(/^last name/i), 'Antonia');
  await userEvent.type(screen.getByLabelText(/email address/i), 'tessa@email.com');
  await userEvent.type(screen.getByLabelText(/mobile number/i), '0412345678');
  await userEvent.type(screen.getByLabelText(/residential address/i), '45 Sample Rd');
  await userEvent.type(screen.getByLabelText(/^start date/i), '2020-03-15');
}

describe('EmployeeFormPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('shows validation messages when required fields are empty', async () => {
    renderWithProviders(<EmployeeFormPage />);

    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(await screen.findByText(/first name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
    expect(api.createEmployee).not.toHaveBeenCalled();
  });

it('rejects an invalid email address', async () => {
  renderWithProviders(<EmployeeFormPage />);

  await userEvent.type(screen.getByLabelText(/email address/i), 'not-an-email');
  await userEvent.click(screen.getByRole('button', { name: /save/i }));

  expect(
    await screen.findByText(/must be a valid email address/i, {}, { timeout: 3000 })
  ).toBeInTheDocument();
});
  it('rejects a non-Australian mobile number', async () => {
    renderWithProviders(<EmployeeFormPage />);

    await userEvent.type(screen.getByLabelText(/mobile number/i), '12345');
    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(
      await screen.findByText(/must be a valid australian mobile number/i)
    ).toBeInTheDocument();
  });

  it('requires a finish date when the role is not ongoing', async () => {
    renderWithProviders(<EmployeeFormPage />);

    await fillValidForm();
    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(
      await screen.findByText(/finish date is required unless the role is ongoing/i)
    ).toBeInTheDocument();
    expect(api.createEmployee).not.toHaveBeenCalled();
  });

  it('disables the finish date field when ongoing is ticked', async () => {
    renderWithProviders(<EmployeeFormPage />);

    const finishDate = screen.getByLabelText(/finish date/i);
    expect(finishDate).not.toBeDisabled();

    await userEvent.click(screen.getByLabelText(/on going/i));

    expect(finishDate).toBeDisabled();
  });

  it('submits the employee when ongoing is ticked and no finish date is given', async () => {
    vi.mocked(api.createEmployee).mockResolvedValue({ id: 1 } as never);

    renderWithProviders(<EmployeeFormPage />);

    await fillValidForm();
    await userEvent.click(screen.getByLabelText(/on going/i));
    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(api.createEmployee).toHaveBeenCalled();
    });

    const submitted = vi.mocked(api.createEmployee).mock.calls[0][0];
    expect(submitted.firstName).toBe('Tessa');
    expect(submitted.finishDate).toBeNull();
    expect(submitted.middleName).toBeNull();
  });

  it('rejects a finish date that falls before the start date', async () => {
    renderWithProviders(<EmployeeFormPage />);

    await fillValidForm();
    await userEvent.type(screen.getByLabelText(/finish date/i), '2019-01-01');
    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(
      await screen.findByText(/finish date must be after the start date/i)
    ).toBeInTheDocument();
  });
});