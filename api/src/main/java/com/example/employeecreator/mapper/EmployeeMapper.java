package com.example.employeecreator.mapper;

import org.springframework.stereotype.Component;

import com.example.employeecreator.dto.CreateEmployeeRequest;
import com.example.employeecreator.model.Employee;

@Component
public class EmployeeMapper {
    public Employee toEntity(CreateEmployeeRequest request) {
        Employee employee = new Employee();
        employee.setFirstName(request.getFirstName());
        employee.setMiddleName(request.getMiddleName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setMobileNumber(request.getMobileNumber());
        employee.setAddress(request.getAddress());
        employee.setContractType(request.getContractType());
        employee.setStartDate(request.getStartDate());
        employee.setFinishDate(request.getFinishDate());
        employee.setOngoing(request.isOngoing());
        employee.setEmploymentBasis(request.getEmploymentBasis());
        employee.setHoursPerWeek(request.getHoursPerWeek());
        return employee;

    }

        public void updateEntity(Employee employee, CreateEmployeeRequest request) {
        employee.setFirstName(request.getFirstName());
        employee.setMiddleName(request.getMiddleName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setMobileNumber(request.getMobileNumber());
        employee.setAddress(request.getAddress());
        employee.setContractType(request.getContractType());
        employee.setStartDate(request.getStartDate());
        employee.setFinishDate(request.getFinishDate());
        employee.setOngoing(request.isOngoing());
        employee.setEmploymentBasis(request.getEmploymentBasis());
        employee.setHoursPerWeek(request.getHoursPerWeek());
    }
}
