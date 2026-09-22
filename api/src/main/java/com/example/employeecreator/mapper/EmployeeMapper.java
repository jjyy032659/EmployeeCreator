package com.example.employeecreator.mapper;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.example.employeecreator.dto.ContractRequest;
import com.example.employeecreator.dto.ContractResponse;
import com.example.employeecreator.dto.CreateEmployeeRequest;
import com.example.employeecreator.dto.EmployeeResponse;
import com.example.employeecreator.model.Contract;
import com.example.employeecreator.model.Employee;

@Component
public class EmployeeMapper {

    // ---------- Employee ----------

    public Employee toEntity(CreateEmployeeRequest request) {
        Employee employee = new Employee();
        updateEntity(employee, request);
        return employee;
    }

    public void updateEntity(Employee employee, CreateEmployeeRequest request) {
        employee.setFirstName(request.getFirstName());
        employee.setMiddleName(request.getMiddleName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setMobileNumber(request.getMobileNumber());
        employee.setAddress(request.getAddress());
    }

    public EmployeeResponse toResponse(Employee employee) {
        List<ContractResponse> contracts = new ArrayList<>();
        for (Contract contract : employee.getContracts()) {
            contracts.add(toContractResponse(contract));
        }

        return new EmployeeResponse(
                employee.getId(),
                employee.getFirstName(),
                employee.getMiddleName(),
                employee.getLastName(),
                employee.getEmail(),
                employee.getMobileNumber(),
                employee.getAddress(),
                contracts);
    }

    // ---------- Contract ----------

    public Contract toContractEntity(ContractRequest request) {
        Contract contract = new Contract();
        updateContractEntity(contract, request);
        return contract;
    }

    public void updateContractEntity(Contract contract, ContractRequest request) {
        contract.setPosition(request.getPosition());
        contract.setDepartment(request.getDepartment());
        contract.setContractType(request.getContractType());
        contract.setEmploymentBasis(request.getEmploymentBasis());
        contract.setStartDate(request.getStartDate());
        contract.setFinishDate(request.isOngoing() ? null : request.getFinishDate());
        contract.setOngoing(request.isOngoing());
        contract.setHoursPerWeek(request.getHoursPerWeek());
    }

    public ContractResponse toContractResponse(Contract contract) {
        return new ContractResponse(
                contract.getId(),
                contract.getPosition(),
                contract.getDepartment(),
                contract.getContractType(),
                contract.getEmploymentBasis(),
                contract.getStartDate(),
                contract.getFinishDate(),
                contract.isOngoing(),
                contract.getHoursPerWeek());
    }
}