import type {
  Contract,
  ContractRequest,
  Employee,
  EmployeeRequest,
} from '../types/employee';

const API_URL = import.meta.env.VITE_API_URL;

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? 'Something went wrong');
  }
  return response.json();
}

const jsonHeaders = { 'Content-Type': 'application/json' };

// ---------- Employees ----------

export async function getEmployees(): Promise<Employee[]> {
  const response = await fetch(`${API_URL}/employees`);
  return handleResponse<Employee[]>(response);
}

export async function getEmployee(id: number): Promise<Employee> {
  const response = await fetch(`${API_URL}/employees/${id}`);
  return handleResponse<Employee>(response);
}

export async function createEmployee(data: EmployeeRequest): Promise<Employee> {
  const response = await fetch(`${API_URL}/employees`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });
  return handleResponse<Employee>(response);
}

export async function updateEmployee(id: number, data: EmployeeRequest): Promise<Employee> {
  const response = await fetch(`${API_URL}/employees/${id}`, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });
  return handleResponse<Employee>(response);
}

export async function deleteEmployee(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/employees/${id}`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error('Failed to delete employee');
  }
}

// ---------- Contracts ----------

export async function createContract(
  employeeId: number,
  data: ContractRequest
): Promise<Contract> {
  const response = await fetch(`${API_URL}/employees/${employeeId}/contracts`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });
  return handleResponse<Contract>(response);
}

export async function updateContract(
  contractId: number,
  data: ContractRequest
): Promise<Contract> {
  const response = await fetch(`${API_URL}/contracts/${contractId}`, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });
  return handleResponse<Contract>(response);
}

export async function deleteContract(contractId: number): Promise<void> {
  const response = await fetch(`${API_URL}/contracts/${contractId}`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error('Failed to delete contract');
  }
}