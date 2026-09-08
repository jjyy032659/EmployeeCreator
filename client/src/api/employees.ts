import type { Employee, EmployeeRequest } from '../types/employee';

const API_URL = import.meta.env.VITE_API_URL;

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message ?? 'Something went wrong');
    }
    return response.json();

}

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse<Employee>(response);

}

export async function updateEmployee(id: number, data: EmployeeRequest): Promise<Employee> {
    const response = await fetch(`${API_URL}/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse<Employee>(response);
}
export async function deleteEmployee(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/employees/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete employee');
    }
}