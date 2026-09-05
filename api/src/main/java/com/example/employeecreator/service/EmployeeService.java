package com.example.employeecreator.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.employeecreator.dto.CreateEmployeeRequest;
import com.example.employeecreator.exception.EmployeeNotFoundException;
import com.example.employeecreator.mapper.EmployeeMapper;
import com.example.employeecreator.model.Employee;
import com.example.employeecreator.repository.EmployeeRepository;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final EmployeeMapper employeeMapper;

    public EmployeeService(EmployeeRepository employeeRepository,
            EmployeeMapper employeeMapper) {
        this.employeeRepository = employeeRepository;
        this.employeeMapper = employeeMapper;
    }

    public List<Employee> findAll() {
        return employeeRepository.findAll();
    }

    public Employee findById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException(id));
    }

    public Employee create(CreateEmployeeRequest request) {
        Employee employee = employeeMapper.toEntity(request);
        return employeeRepository.save(employee);
    }

    public void delete(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new EmployeeNotFoundException(id);
        }
        employeeRepository.deleteById(id);
    }

    public Employee update(Long id, CreateEmployeeRequest request) {
        Employee existing = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException(id));

        employeeMapper.updateEntity(existing, request);
        return employeeRepository.save(existing);
    }
}
