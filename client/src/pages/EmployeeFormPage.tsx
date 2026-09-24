import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';

import ContactFields from '../components/employee/ContactFields';
import PersonalInfoFields from '../components/employee/PersonalInfoFields';
import { createEmployee, getEmployee, updateEmployee } from '../api/employees';
import { employeeSchema, type EmployeeFormValues } from '../schemas/employeeSchema';
import type { EmployeeRequest } from '../types/employee';

function EmployeeFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isEditing = Boolean(id);

  const { data: employee } = useQuery({
    queryKey: ['employees', id],
    queryFn: () => getEmployee(Number(id)),
    enabled: isEditing,
  });

  const methods = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      mobileNumber: '',
      address: '',
    },
  });

  useEffect(() => {
    if (employee) {
      methods.reset({
        firstName: employee.firstName,
        middleName: employee.middleName ?? '',
        lastName: employee.lastName,
        email: employee.email,
        mobileNumber: employee.mobileNumber,
        address: employee.address,
      });
    }
  }, [employee, methods]);

  const mutation = useMutation({
    mutationFn: (values: EmployeeRequest) =>
      isEditing ? updateEmployee(Number(id), values) : createEmployee(values),
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      navigate(`/employees/${saved.id}`);
    },
  });

  const onSubmit = (values: EmployeeFormValues) => {
    mutation.mutate({
      ...values,
      middleName: values.middleName || null,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-band px-6 py-10">
        <div className="mx-auto max-w-2xl">
          <Link to="/" className="text-sm text-gray-600 hover:underline">
            &lt; Back
          </Link>
          <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
            {isEditing ? 'Edit employee' : 'New employee'}
          </h1>
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
            <PersonalInfoFields />
            <ContactFields />

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
                onClick={() => navigate('/')}
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

export default EmployeeFormPage;