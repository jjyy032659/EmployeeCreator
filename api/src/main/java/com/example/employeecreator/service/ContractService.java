package com.example.employeecreator.service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.employeecreator.dto.ContractRequest;
import com.example.employeecreator.dto.ContractResponse;
import com.example.employeecreator.exception.ActiveContractExistsException;
import com.example.employeecreator.exception.ContractNotFoundException;
import com.example.employeecreator.exception.EmployeeNotFoundException;
import com.example.employeecreator.mapper.EmployeeMapper;
import com.example.employeecreator.model.Contract;
import com.example.employeecreator.model.Employee;
import com.example.employeecreator.repository.ContractRepository;
import com.example.employeecreator.repository.EmployeeRepository;

@Service
public class ContractService {

    private static final Logger log = LoggerFactory.getLogger(ContractService.class);

    private final EmployeeRepository employeeRepository;
    private final ContractRepository contractRepository;
    private final EmployeeMapper mapper;

    public ContractService(EmployeeRepository employeeRepository,
                           ContractRepository contractRepository,
                           EmployeeMapper mapper) {
        this.employeeRepository = employeeRepository;
        this.contractRepository = contractRepository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<ContractResponse> findByEmployee(Long employeeId) {
        Employee employee = getEmployeeOrThrow(employeeId);
        List<ContractResponse> responses = new ArrayList<>();
        for (Contract contract : employee.getContracts()) {
            responses.add(mapper.toContractResponse(contract));
        }
        return responses;
    }

    @Transactional
    public ContractResponse create(Long employeeId, ContractRequest request) {
        log.info("Adding contract to employee {}", employeeId);
        Employee employee = getEmployeeOrThrow(employeeId);

        if (request.isOngoing() && contractRepository.existsByEmployeeIdAndOngoingTrue(employeeId)) {
            log.warn("Employee {} already has an ongoing contract", employeeId);
            throw new ActiveContractExistsException(employeeId);
        }

        Contract contract = mapper.toContractEntity(request);
        employee.addContract(contract);
        Contract saved = contractRepository.save(contract);
        return mapper.toContractResponse(saved);
    }

    @Transactional
    public ContractResponse update(Long contractId, ContractRequest request) {
        log.info("Updating contract {}", contractId);
        Contract contract = getContractOrThrow(contractId);
        Long employeeId = contract.getEmployee().getId();

        if (request.isOngoing()
                && contractRepository.existsByEmployeeIdAndOngoingTrueAndIdNot(employeeId, contractId)) {
            log.warn("Employee {} already has another ongoing contract", employeeId);
            throw new ActiveContractExistsException(employeeId);
        }

        mapper.updateContractEntity(contract, request);
        return mapper.toContractResponse(contract);
    }

    @Transactional
    public void delete(Long contractId) {
        log.info("Deleting contract {}", contractId);
        Contract contract = getContractOrThrow(contractId);
        contract.getEmployee().removeContract(contract);
    }

    private Employee getEmployeeOrThrow(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException(id));
    }

    private Contract getContractOrThrow(Long id) {
        return contractRepository.findById(id)
                .orElseThrow(() -> new ContractNotFoundException(id));
    }
}