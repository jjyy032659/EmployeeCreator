import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { deleteContract, getEmployee } from '../api/employees';
import type { Contract } from '../types/employee';

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function contractLabel(contract: Contract): string {
  const start = formatDate(contract.startDate);
  const end = contract.ongoing ? 'Present' : formatDate(contract.finishDate!);
  return `${start} – ${end}`;
}

function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const employeeId = Number(id);

  const { data: employee, isLoading, error } = useQuery({
    queryKey: ['employees', id],
    queryFn: () => getEmployee(employeeId),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContract,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });

  const handleRemove = (contract: Contract) => {
    if (window.confirm(`Remove the ${contract.position} contract?`)) {
      deleteMutation.mutate(contract.id);
    }
  };

  if (isLoading) return <p className="p-6">Loading employee...</p>;
  if (error) return <p className="p-6">Could not load employee: {error.message}</p>;
  if (!employee) return null;

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-band px-6 py-10">
        <div className="mx-auto max-w-2xl">
          <Link to="/" className="text-sm text-gray-600 hover:underline">
            &lt; Back to list
          </Link>
          <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
            {employee.firstName} {employee.lastName}
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10 space-y-10">
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Details</h2>
            <Link
              to={`/employees/${employee.id}/edit`}
              className="text-blue-600 hover:underline"
            >
              Edit
            </Link>
          </div>
          <p className="text-gray-600">{employee.email}</p>
          <p className="text-gray-600">{employee.mobileNumber}</p>
          <p className="text-gray-600">{employee.address}</p>
        </section>

        <section>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-gray-900">Contract history</h2>
            <Link
              to={`/employees/${employee.id}/contracts/new`}
              className="rounded bg-brand px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-brand-hover"
            >
              Add contract
            </Link>
          </div>

          {employee.contracts.length === 0 && (
            <p className="py-8 text-center text-gray-500">No contracts yet.</p>
          )}

          <ul className="divide-y divide-gray-200 border-t border-gray-200">
            {employee.contracts.map((contract) => (
              <li
                key={contract.id}
                className="flex flex-col gap-2 py-5 sm:flex-row sm:items-start sm:justify-between"
              >
                <div>
                  <p className="font-bold text-gray-900">
                    {contract.position}
                    {contract.ongoing && (
                      <span className="ml-2 rounded bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
                        Current
                      </span>
                    )}
                  </p>
                  <p className="text-gray-600">{contract.department}</p>
                  <p className="text-gray-600">{contractLabel(contract)}</p>
                  <p className="text-sm text-gray-500">
                    {contract.contractType === 'PERMANENT' ? 'Permanent' : 'Contract'}
                    {' · '}
                    {contract.employmentBasis === 'FULL_TIME' ? 'Full-time' : 'Part-time'}
                    {' · '}
                    {contract.hoursPerWeek} hrs/week
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3 text-blue-600">
                  <Link
                    to={`/contracts/${contract.id}/edit`}
                    className="hover:underline"
                  >
                    Edit
                  </Link>
                  <span className="text-gray-300">|</span>
                  <button onClick={() => handleRemove(contract)} className="hover:underline">
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default EmployeeDetailPage;