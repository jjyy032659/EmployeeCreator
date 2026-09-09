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

return(

<div>
<header>
        <h1>Employees' list</h1>
      </header>
 <p>Please click on 'Edit' to find more details of each employee.</p>
      <Link to="/employees/new">Add employee</Link>
{employees?.length === 0 && <p>No employees yet.</p>}

 <ul>
        {employees?.map((employee) => (
          <li key={employee.id}>
            <strong>{employee.firstName} {employee.lastName}</strong>
            <p>{employee.email}</p>
            <Link to={`/employees/${employee.id}/edit`}>Edit</Link>
            <button onClick={() => handleRemove(employee.id, employee.firstName)}>
              Remove
            </button>
          </li>
        ))}
      </ul>

</div>

)



}


export default  EmployeeListPage;