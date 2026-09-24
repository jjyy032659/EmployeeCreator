import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';

import ContractFields from '../components/employee/ContractFields';
import { createContract, getEmployee, updateContract } from '../api/employees';
import { contractSchema, type ContractFormValues } from '../schemas/contractSchema';
import type { ContractRequest } from '../types/employee';

function ContractFormPage() {
  const { id, contractId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isEditing = Boolean(contractId);

  // When editing we only have the contract id, so load the employee
  // that owns it via the list and find the contract in it.
  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { getEmployees } = await import('../api/employees');
      return getEmployees();
    },
    enabled: isEditing,
  });

  const { data: employee } = useQuery({
    queryKey: ['employees', id],
    queryFn: () => getEmployee(Number(id)),
    enabled: !isEditing && Boolean(id),
  });

  const existingContract = isEditing
    ? employees
        ?.flatMap((e) => e.contracts.map((c) => ({ ...c, employeeId: e.id })))
        .find((c) => c.id === Number(contractId))
    : undefined;

  const methods = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      position: '',
      department: '',
      contractType: 'PERMANENT',
      employmentBasis: 'FULL_TIME',
      startDate: '',
      finishDate: '',
      ongoing: false,
      hoursPerWeek: 38,
    },
  });

  useEffect(() => {
    if (existingContract) {
      methods.reset({
        position: existingContract.position,
        department: existingContract.department,
        contractType: existingContract.contractType,
        employmentBasis: existingContract.employmentBasis,
        startDate: existingContract.startDate,
        finishDate: existingContract.finishDate ?? '',
        ongoing: existingContract.ongoing,
        hoursPerWeek: existingContract.hoursPerWeek,
      });
    }
  }, [existingContract, methods]);

  const employeeId = isEditing ? existingContract?.employeeId : Number(id);

  const mutation = useMutation({
    mutationFn: (values: ContractRequest) =>
      isEditing
        ? updateContract(Number(contractId), values)
        : createContract(Number(id), values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      navigate(`/employees/${employeeId}`);
    },
  });

  const onSubmit = (values: ContractFormValues) => {
    mutation.mutate({
      ...values,
      finishDate: values.ongoing ? null : values.finishDate || null,
    });
  };

  const backTo = employeeId ? `/employees/${employeeId}` : '/';

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-band px-6 py-10">
        <div className="mx-auto max-w-2xl">
          <Link to={backTo} className="text-sm text-gray-600 hover:underline">
            &lt; Back
          </Link>
          <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
            {isEditing ? 'Edit contract' : 'New contract'}
          </h1>
          {employee && !isEditing && (
            <p className="mt-1 text-gray-600">
              for {employee.firstName} {employee.lastName}
            </p>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10">
        {mutation.isError && (
          <div className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {mutation.error.message}
          </div>
        )}

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-10" noValidate>
            <ContractFields />

            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <button
                type="submit"
                disabled={mutation.isPending}
                className="rounded bg-brand px-8 py-3 font-semibold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {mutation.isPending ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => navigate(backTo)}
                className="rounded border border-gray-300 px-8 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </FormProvider>
      </main>
    </div>
  );
}

export default ContractFormPage;