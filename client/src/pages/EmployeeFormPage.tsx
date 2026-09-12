import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams, Link } from 'react-router-dom';

import { employeeSchema, type EmployeeFormValues } from '../schemas/employeeSchema';
import { getEmployee, createEmployee, updateEmployee } from '../api/employees';
import type { EmployeeRequest } from '../types/employee';

const labelClass = 'block text-sm font-semibold text-gray-900';

const inputClass =
  'mt-1 w-full rounded border border-gray-400 px-3 py-2 ' +
  'focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand';

const errorClass = 'mt-1 text-sm text-red-600';

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

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      mobileNumber: '',
      address: '',
      contractType: 'PERMANENT',
      startDate: '',
      finishDate: '',
      ongoing: false,
      employmentBasis: 'FULL_TIME',
      hoursPerWeek: 38,
    },
  });

  useEffect(() => {
    if (employee) {
      reset({
        firstName: employee.firstName,
        middleName: employee.middleName ?? '',
        lastName: employee.lastName,
        email: employee.email,
        mobileNumber: employee.mobileNumber,
        address: employee.address,
        contractType: employee.contractType,
        startDate: employee.startDate,
        finishDate: employee.finishDate ?? '',
        ongoing: employee.ongoing,
        employmentBasis: employee.employmentBasis,
        hoursPerWeek: employee.hoursPerWeek,
      });
    }
  }, [employee, reset]);

  const isOngoing = watch('ongoing');

  const mutation = useMutation({
    mutationFn: (values: EmployeeRequest) =>
      isEditing ? updateEmployee(Number(id), values) : createEmployee(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      navigate('/');
    },
  });

  const onSubmit = (values: EmployeeFormValues) => {
    mutation.mutate({
      ...values,
      middleName: values.middleName || null,
      finishDate: values.ongoing ? null : values.finishDate || null,
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
            Employee details
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10">
        {mutation.isError && (
          <div className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {mutation.error.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          <section className="space-y-5">
            <h2 className="text-xl font-bold text-gray-900">Personal information</h2>

            <div>
              <label htmlFor="firstName" className={labelClass}>First name</label>
              <input id="firstName" {...register('firstName')} className={inputClass} />
              {errors.firstName && <p className={errorClass}>{errors.firstName.message}</p>}
            </div>

            <div>
              <label htmlFor="middleName" className={labelClass}>
                Middle name (if applicable)
              </label>
              <input id="middleName" {...register('middleName')} className={inputClass} />
              {errors.middleName && <p className={errorClass}>{errors.middleName.message}</p>}
            </div>

            <div>
              <label htmlFor="lastName" className={labelClass}>Last name</label>
              <input id="lastName" {...register('lastName')} className={inputClass} />
              {errors.lastName && <p className={errorClass}>{errors.lastName.message}</p>}
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="text-xl font-bold text-gray-900">Contact details</h2>

            <div>
              <label htmlFor="email" className={labelClass}>Email address</label>
              <input id="email" type="email" {...register('email')} className={inputClass} />
              {errors.email && <p className={errorClass}>{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="mobileNumber" className={labelClass}>Mobile number</label>
              <p className="mb-1 text-sm text-gray-500">Must be an Australian number</p>
              <input
                id="mobileNumber"
                placeholder="0412345678"
                {...register('mobileNumber')}
                className={inputClass}
              />
              {errors.mobileNumber && <p className={errorClass}>{errors.mobileNumber.message}</p>}
            </div>

            <div>
              <label htmlFor="address" className={labelClass}>Residential address</label>
              <input id="address" {...register('address')} className={inputClass} />
              {errors.address && <p className={errorClass}>{errors.address.message}</p>}
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="text-xl font-bold text-gray-900">Employee status</h2>

            <fieldset>
              <legend className={labelClass}>What is contract type?</legend>
              <div className="mt-2 space-y-2">
                <label className="flex items-center gap-3">
                  <input type="radio" value="PERMANENT" {...register('contractType')} className="h-4 w-4" />
                  <span>Permanent</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="radio" value="CONTRACT" {...register('contractType')} className="h-4 w-4" />
                  <span>Contract</span>
                </label>
              </div>
              {errors.contractType && <p className={errorClass}>{errors.contractType.message}</p>}
            </fieldset>

            <div>
              <label htmlFor="startDate" className={labelClass}>Start date</label>
              <input id="startDate" type="date" {...register('startDate')} className={inputClass} />
              {errors.startDate && <p className={errorClass}>{errors.startDate.message}</p>}
            </div>

            <div>
              <label htmlFor="finishDate" className={labelClass}>Finish date</label>
              <input
                id="finishDate"
                type="date"
                disabled={isOngoing}
                {...register('finishDate')}
                className={`${inputClass} disabled:cursor-not-allowed disabled:bg-gray-100`}
              />
              {errors.finishDate && <p className={errorClass}>{errors.finishDate.message}</p>}

              <label className="mt-3 flex items-center gap-3">
                <input type="checkbox" {...register('ongoing')} className="h-4 w-4" />
                <span>On going</span>
              </label>
            </div>

            <fieldset>
              <legend className={labelClass}>
                Is this on a full-time or part-time basis?
              </legend>
              <div className="mt-2 space-y-2">
                <label className="flex items-center gap-3">
                  <input type="radio" value="FULL_TIME" {...register('employmentBasis')} className="h-4 w-4" />
                  <span>Full-time</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="radio" value="PART_TIME" {...register('employmentBasis')} className="h-4 w-4" />
                  <span>Part-time</span>
                </label>
              </div>
              {errors.employmentBasis && <p className={errorClass}>{errors.employmentBasis.message}</p>}
            </fieldset>

            <div>
              <label htmlFor="hoursPerWeek" className={labelClass}>Hours per week</label>
              <input
                id="hoursPerWeek"
                type="number"
                {...register('hoursPerWeek', { valueAsNumber: true })}
                className={`${inputClass} max-w-32`}
              />
              {errors.hoursPerWeek && <p className={errorClass}>{errors.hoursPerWeek.message}</p>}
            </div>
          </section>

          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <button
              type="submit"
              disabled={isSubmitting || mutation.isPending}
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
      </main>
    </div>
  );
}

export default EmployeeFormPage;