import { useEffect } from 'react';
import { getEmployees } from './api/employees';

function App() {
  useEffect(() => {
    console.log('API_URL:', import.meta.env.VITE_API_URL);
    getEmployees()
      .then((employees) => console.log('Employees:', employees))
      .catch((error) => console.error('Failed:', error));
  }, []);

  return <h1>Employee Creator</h1>;
}

export default App;