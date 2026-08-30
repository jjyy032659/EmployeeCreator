package com.example.employeecreator.service;
package com.example.employeecreator.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.employeecreator.model.Employee;
import com.example.employeecreator.repository.EmployeeRepository;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository){
         this.employeeRepository = employeeRepository;
    }
public List<Employee> findAll() {
        return employeeRepository.findAll();
    }
}
