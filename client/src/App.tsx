import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ContractFormPage from './pages/ContractFormPage';
import EmployeeDetailPage from './pages/EmployeeDetailPage';
import EmployeeFormPage from './pages/EmployeeFormPage';
import EmployeeListPage from './pages/EmployeeListPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EmployeeListPage />} />
        <Route path="/employees/new" element={<EmployeeFormPage />} />
        <Route path="/employees/:id" element={<EmployeeDetailPage />} />
        <Route path="/employees/:id/edit" element={<EmployeeFormPage />} />
        <Route path="/employees/:id/contracts/new" element={<ContractFormPage />} />
        <Route path="/contracts/:contractId/edit" element={<ContractFormPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;