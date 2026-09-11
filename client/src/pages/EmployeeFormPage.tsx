import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams, Link } from 'react-router-dom';

import { employeeSchema, type EmployeeFormValues } from '../schemas/employeeSchema';
import { getEmployee, createEmployee, updateEmployee } from '../api/employees';
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
    <div>
      <Link to="/">&lt; Back</Link>
      <h1>Employee details</h1>

      {mutation.isError && <p>{mutation.error.message}</p>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Personal information</h2>

        <label htmlFor="firstName">First name</label>
        <input id="firstName" {...register('firstName')} />
        {errors.firstName && <span>{errors.firstName.message}</span>}

        <label htmlFor="middleName">Middle name (if applicable)</label>
        <input id="middleName" {...register('middleName')} />
        {errors.middleName && <span>{errors.middleName.message}</span>}

        <label htmlFor="lastName">Last name</label>
        <input id="lastName" {...register('lastName')} />
        {errors.lastName && <span>{errors.lastName.message}</span>}

        <h2>Contact details</h2>

        <label htmlFor="email">Email address</label>
        <input id="email" type="email" {...register('email')} />
        {errors.email && <span>{errors.email.message}</span>}

        <label htmlFor="mobileNumber">Mobile number</label>
        <input id="mobileNumber" placeholder="0412345678" {...register('mobileNumber')} />
        {errors.mobileNumber && <span>{errors.mobileNumber.message}</span>}

        <label htmlFor="address">Residential address</label>
        <input id="address" {...register('address')} />
        {errors.address && <span>{errors.address.message}</span>}

        <h2>Employee status</h2>

        <fieldset>
          <legend>What is contract type?</legend>
          <label>
            <input type="radio" value="PERMANENT" {...register('contractType')} />
            Permanent
          </label>
          <label>
            <input type="radio" value="CONTRACT" {...register('contractType')} />
            Contract
          </label>
        </fieldset>
        {errors.contractType && <span>{errors.contractType.message}</span>}

        <label htmlFor="startDate">Start date</label>
        <input id="startDate" type="date" {...register('startDate')} />
        {errors.startDate && <span>{errors.startDate.message}</span>}

        <label htmlFor="finishDate">Finish date</label>
        <input id="finishDate" type="date" disabled={isOngoing} {...register('finishDate')} />
        {errors.finishDate && <span>{errors.finishDate.message}</span>}

        <label>
          <input type="checkbox" {...register('ongoing')} />
          On going
        </label>

        <fieldset>
          <legend>Is this on a full-time or part-time basis?</legend>
          <label>
            <input type="radio" value="FULL_TIME" {...register('employmentBasis')} />
            Full-time
          </label>
          <label>
            <input type="radio" value="PART_TIME" {...register('employmentBasis')} />
            Part-time
          </label>
        </fieldset>
        {errors.employmentBasis && <span>{errors.employmentBasis.message}</span>}

        <label htmlFor="hoursPerWeek">Hours per week</label>
        <input
          id="hoursPerWeek"
          type="number"
          {...register('hoursPerWeek', { valueAsNumber: true })}
        />
        {errors.hoursPerWeek && <span>{errors.hoursPerWeek.message}</span>}

        <button type="submit" disabled={isSubmitting || mutation.isPending}>
          {mutation.isPending ? 'Saving...' : 'Save'}
        </button>
        <button type="button" onClick={() => navigate('/')}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EmployeeFormPage;