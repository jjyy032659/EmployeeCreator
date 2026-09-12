import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getEmployees, deleteEmployee } from '../api/employees';


function EmployeeListPage(){
const queryClient=useQueryClient();

const {data:employees, isLoading, error}=useQuery({
queryKey:['employees'],
queryFn:getEmployees,
});

const deleteMutation=useMutation({
mutationFn:deleteEmployee,
onSuccess:()=>{
    queryClient.invalidateQueries({queryKey:['employees']});
},

});

const handleRemove=(id:number, name:string)=>{
if(window.confirm(`Remove ${name}?`)){
    deleteMutation.mutate(id);
}
}
  if (isLoading) return <p>Loading employees...</p>;
  if (error) return <p>Could not load employees: {error.message}</p>;
 return (
    <div className="min-h-screen bg-white">
      <header className="bg-band py-16 px-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Employees' list
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-gray-600">
            Please click on 'Edit' to find more details of each employee.
          </p>
          <Link
            to="/employees/new"
            className="rounded bg-brand px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            Add employee
          </Link>
        </div>

        {employees?.length === 0 && (
          <p className="py-12 text-center text-gray-500">No employees yet.</p>
        )}

        <ul className="divide-y divide-gray-200 border-t border-gray-200">
          {employees?.map((employee) => (
            <li
              key={employee.id}
              className="flex flex-col gap-2 py-5 sm:flex-row sm:items-start sm:justify-between"
            >
              <div>
                <p className="font-bold text-gray-900">
                  {employee.firstName} {employee.lastName}
                </p>
                <p className="text-gray-600">
                  {employee.contractType === 'PERMANENT' ? 'Permanent' : 'Contract'}
                  {' – '}
                  {yearsOfService(employee.startDate)}
                </p>
                <p className="text-gray-600">{employee.email}</p>
              </div>

              <div className="flex shrink-0 items-center gap-3 text-blue-600">
                <Link to={`/employees/${employee.id}/edit`} className="hover:underline">
                  Edit
                </Link>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => handleRemove(employee.id, employee.firstName)}
                  className="hover:underline"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );


}

function yearsOfService(startDate: string): string {
  const start = new Date(startDate);
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();

  const monthDiff = now.getMonth() - start.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < start.getDate())) {
    years--;
  }

  if (years < 1) return 'less than 1yr';
  return `${years}yr${years === 1 ? '' : 's'}`;
}
export default  EmployeeListPage;