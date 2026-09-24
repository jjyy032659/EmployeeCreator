import { z } from 'zod';

export const employeeSchema = z.object({
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
    .max(255)
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Must be a valid email address'),

  mobileNumber: z
    .string()
    .min(1, 'Mobile number is required')
    .regex(/^(\+61|0)[45]\d{8}$/, 'Must be a valid Australian mobile number'),

  address: z
    .string()
    .min(1, 'Address is required')
    .max(255, 'Address must be 255 characters or fewer'),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;