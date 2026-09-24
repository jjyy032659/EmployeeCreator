package com.example.employeecreator.service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.employeecreator.dto.CreateEmployeeRequest;
import com.example.employeecreator.dto.EmployeeResponse;
import com.example.employeecreator.exception.EmployeeNotFoundException;
import com.example.employeecreator.mapper.EmployeeMapper;
import com.example.employeecreator.model.Employee;
import com.example.employeecreator.repository.EmployeeRepository;

@Service
public class EmployeeService {

    private static final Logger log = LoggerFactory.getLogger(EmployeeService.class);

    private final EmployeeRepository employeeRepository;
    private final EmployeeMapper employeeMapper;

    public EmployeeService(EmployeeRepository employeeRepository, EmployeeMapper employeeMapper) {
        this.employeeRepository = employeeRepository;
        this.employeeMapper = employeeMapper;
    }

    @Transactional(readOnly = true)
    public List<EmployeeResponse> findAll() {
        log.info("Fetching all employees");
        List<EmployeeResponse> responses = new ArrayList<>();
        for (Employee employee : employeeRepository.findAllWithContracts()) {
            responses.add(employeeMapper.toResponse(employee));
        }
        return responses;
    }

    @Transactional(readOnly = true)
    public EmployeeResponse findById(Long id) {
        log.info("Fetching employee with id {}", id);
        return employeeMapper.toResponse(getEmployeeOrThrow(id));
    }

    @Transactional
    public EmployeeResponse create(CreateEmployeeRequest request) {
        log.info("Creating employee with email {}", request.getEmail());
        Employee saved = employeeRepository.save(employeeMapper.toEntity(request));
        log.info("Created employee with id {}", saved.getId());
        return employeeMapper.toResponse(saved);
    }

    @Transactional
    public EmployeeResponse update(Long id, CreateEmployeeRequest request) {
        log.info("Updating employee with id {}", id);
        Employee employee = getEmployeeOrThrow(id);
        employeeMapper.updateEntity(employee, request);
        return employeeMapper.toResponse(employee);
    }

    @Transactional
    public void delete(Long id) {
        log.info("Deleting employee with id {}", id);
        employeeRepository.delete(getEmployeeOrThrow(id));
    }

    private Employee getEmployeeOrThrow(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Employee not found with id {}", id);
                    return new EmployeeNotFoundException(id);
                });
    }
}