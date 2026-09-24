export type ContractType = 'PERMANENT' | 'CONTRACT';

export type EmploymentBasis = 'FULL_TIME' | 'PART_TIME';

export interface Contract {
  id: number;
  position: string;
  department: string;
  contractType: ContractType;
  employmentBasis: EmploymentBasis;
  startDate: string;
  finishDate: string | null;
  ongoing: boolean;
  hoursPerWeek: number;
}

export interface Employee {
  id: number;
  firstName: string;
  middleName: string | null;
  lastName: string;
  email: string;
  mobileNumber: string;
  address: string;
  contracts: Contract[];
}

export type EmployeeRequest = Omit<Employee, 'id' | 'contracts'>;

export type ContractRequest = Omit<Contract, 'id'>;