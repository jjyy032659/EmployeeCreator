import { useEffect } from 'react';
import { getEmployees } from './api/employees';
import { useQuery } from '@tanstack/react-query';


function App() {
  const { data: employees, isLoading, error } = useQuery({
    queryKey: ['employees'],
    queryFn: getEmployees,
  });

  if (isLoading) return <p>Loading</p>
  if (error) return <p>Error:{error.message}</p>

  return (<div>
    <ul>
      {employees?.map((employee) => (
        <li key={employee.id}>
          {employee.firstName} {employee.lastName} — {employee.email}
        </li>
      ))}
    </ul>
  </div>)


}

export default App;