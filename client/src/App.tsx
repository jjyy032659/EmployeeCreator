import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EmployeeListPage from './pages/EmployeeListPage.tsx';
import EmployeeFormPage from './pages/EmployeeFormPage.tsx';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EmployeeListPage />}></Route>
        <Route path="/employees/new" element={<EmployeeFormPage />}></Route>
        <Route path="/employees/:id/edit" element={<EmployeeFormPage />}></Route>
      </Routes>


    </BrowserRouter>


  )
}
  export default App;