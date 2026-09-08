

export type ContractType = 'PERMANENT' | 'CONTRACT';

export type EmploymentBasis = 'FULL_TIME' | 'PART_TIME';

export interface Employee {
  id: number;
  firstName: string;
  middleName: string | null;
  lastName: string;
  email: string;
  mobileNumber: string;
  address: string;
  contractType: ContractType;
  startDate: string;
  finishDate: string | null;
  ongoing: boolean;
  employmentBasis: EmploymentBasis;
  hoursPerWeek: number;
}

export type EmployeeRequest = Omit<Employee, 'id'>;