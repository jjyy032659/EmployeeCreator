import { z } from 'zod';

export const employeeSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'First name is required')
      .max(50, 'First name must be 50 characters or fewer'),

    middleName: z
      .string()
      .max(50, 'Middle name must be 50 characters or fewer')
      .optional(),

    lastName: z
      .string()
      .min(1, 'Last name is required')
      .max(50, 'Last name must be 50 characters or fewer'),

    email: z
      .string()
      .min(1, 'Email is required')
      .email('Must be a valid email address')
      .max(255),

    mobileNumber: z
      .string()
      .min(1, 'Mobile number is required')
      .regex(/^(\+61|0)[45]\d{8}$/, 'Must be a valid Australian mobile number'),

    address: z
      .string()
      .min(1, 'Address is required')
      .max(255, 'Address must be 255 characters or fewer'),

    contractType: z.enum(['PERMANENT', 'CONTRACT'], {
      message: 'Please select a contract type',


    }),

    startDate: z.string().min(1, 'Start date is required'),

    finishDate: z.string().optional(),

    ongoing: z.boolean(),

    employmentBasis: z.enum(['FULL_TIME', 'PART_TIME'], {
      message: 'Please select full-time or part-time',
    }),

    hoursPerWeek: z
      .number({ message: 'Hours per week is required' })
      .min(1, 'Hours per week must be at least 1')
      .max(168, 'Hours per week cannot exceed 168'),
  })

  .refine(
    (data) => data.ongoing || (data.finishDate && data.finishDate.length > 0),
    {
      message: 'Finish date is required unless the role is ongoing',
      path: ['finishDate'],
    }
  )
  .refine(
    (data) => {
      if (!data.finishDate) return true;
      return new Date(data.finishDate) > new Date(data.startDate);
    },
    {
      message: 'Finish date must be after the start date',
      path: ['finishDate'],
    }
  );

export type EmployeeFormValues = z.infer<typeof employeeSchema>;