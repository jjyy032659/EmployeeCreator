import { z } from 'zod';

export const contractSchema = z
  .object({
    position: z
      .string()
      .min(1, 'Position is required')
      .max(100, 'Position must be 100 characters or fewer'),

    department: z
      .string()
      .min(1, 'Department is required')
      .max(100, 'Department must be 100 characters or fewer'),

    contractType: z.enum(['PERMANENT', 'CONTRACT'], {
      message: 'Please select a contract type',
    }),

    employmentBasis: z.enum(['FULL_TIME', 'PART_TIME'], {
      message: 'Please select full-time or part-time',
    }),

    startDate: z
      .string()
      .min(1, 'Start date is required')
      .refine((value) => new Date(value) <= new Date(), {
        message: 'Start date cannot be in the future',
      }),

    finishDate: z.string().optional(),

    ongoing: z.boolean(),

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

export type ContractFormValues = z.infer<typeof contractSchema>;