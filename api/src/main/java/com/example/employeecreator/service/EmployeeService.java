package com.example.employeecreator.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.example.employeecreator.dto.CreateEmployeeRequest;
import com.example.employeecreator.exception.EmployeeNotFoundException;
import com.example.employeecreator.mapper.EmployeeMapper;
import com.example.employeecreator.model.Employee;
import com.example.employeecreator.repository.EmployeeRepository;

@Service
public class EmployeeService {
    private static final Logger log = LoggerFactory.getLogger(EmployeeService.class);
    private final EmployeeRepository employeeRepository;
    private final EmployeeMapper employeeMapper;

    public EmployeeService(EmployeeRepository employeeRepository,
            EmployeeMapper employeeMapper) {
        this.employeeRepository = employeeRepository;
        this.employeeMapper = employeeMapper;
    }

    public List<Employee> findAll() {
         log.info("Fetching all employees");
        return employeeRepository.findAll();
    }

      public Employee findById(Long id) {
        log.info("Fetching employee with id {}", id);
        return employeeRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Employee not found with id {}", id);
                    return new EmployeeNotFoundException(id);
                });
    }

     public Employee create(CreateEmployeeRequest request) {
        log.info("Creating employee with email {}", request.getEmail());
        Employee employee = employeeMapper.toEntity(request);
        Employee saved = employeeRepository.save(employee);
        log.info("Created employee with id {}", saved.getId());
        return saved;
    }

      public void delete(Long id) {
        log.info("Deleting employee with id {}", id);
        if (!employeeRepository.existsById(id)) {
            log.warn("Cannot delete - employee not found with id {}", id);
            throw new EmployeeNotFoundException(id);
        }
        employeeRepository.deleteById(id);
        log.info("Deleted employee with id {}", id);
    }

      public Employee update(Long id, CreateEmployeeRequest request) {
        log.info("Updating employee with id {}", id);
        Employee existing = employeeRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Cannot update - employee not found with id {}", id);
                    return new EmployeeNotFoundException(id);
                });
        employeeMapper.updateEntity(existing, request);
        return employeeRepository.save(existing);
    }
}
