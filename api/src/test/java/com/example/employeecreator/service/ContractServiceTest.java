package com.example.employeecreator.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.employeecreator.dto.ContractRequest;
import com.example.employeecreator.dto.ContractResponse;
import com.example.employeecreator.exception.ActiveContractExistsException;
import com.example.employeecreator.mapper.EmployeeMapper;
import com.example.employeecreator.model.Contract;
import com.example.employeecreator.model.ContractType;
import com.example.employeecreator.model.Employee;
import com.example.employeecreator.model.EmploymentBasis;
import com.example.employeecreator.repository.ContractRepository;
import com.example.employeecreator.repository.EmployeeRepository;

@ExtendWith(MockitoExtension.class)
class ContractServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private ContractRepository contractRepository;

    private ContractService contractService;
    private Employee employee;

    @BeforeEach
    void setUp() {
        contractService = new ContractService(employeeRepository, contractRepository, new EmployeeMapper());

        employee = new Employee();
        employee.setId(1L);
        employee.setFirstName("John");
    }

    private ContractRequest request(boolean ongoing) {
        ContractRequest request = new ContractRequest();
        request.setPosition("Mid Developer");
        request.setDepartment("Technology");
        request.setContractType(ContractType.PERMANENT);
        request.setEmploymentBasis(EmploymentBasis.FULL_TIME);
        request.setStartDate(LocalDate.of(2021, 7, 1));
        request.setOngoing(ongoing);
        if (!ongoing) {
            request.setFinishDate(LocalDate.of(2023, 6, 30));
        }
        request.setHoursPerWeek(38);
        return request;
    }

    @Test
    @DisplayName("create adds a contract when the employee has no ongoing contract")
    void createAddsContract() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));
        when(contractRepository.existsByEmployeeIdAndOngoingTrue(1L)).thenReturn(false);
        when(contractRepository.save(any(Contract.class))).thenAnswer(call -> call.getArgument(0));

        ContractResponse result = contractService.create(1L, request(true));

        assertEquals("Mid Developer", result.position());
        assertEquals(1, employee.getContracts().size());
    }

    @Test
    @DisplayName("create rejects a second ongoing contract")
    void createRejectsSecondOngoingContract() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));
        when(contractRepository.existsByEmployeeIdAndOngoingTrue(1L)).thenReturn(true);

        assertThrows(ActiveContractExistsException.class,
                () -> contractService.create(1L, request(true)));

        verify(contractRepository, never()).save(any());
    }

    @Test
    @DisplayName("create allows a finished contract even when an ongoing one exists")
    void createAllowsFinishedContract() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));
        when(contractRepository.save(any(Contract.class))).thenAnswer(call -> call.getArgument(0));

        ContractResponse result = contractService.create(1L, request(false));

        assertEquals(LocalDate.of(2023, 6, 30), result.finishDate());
    }

    @Test
    @DisplayName("update rejects making a contract ongoing when another one already is")
    void updateRejectsSecondOngoingContract() {
        Contract contract = new Contract();
        contract.setId(10L);
        employee.addContract(contract);

        when(contractRepository.findById(10L)).thenReturn(Optional.of(contract));
        when(contractRepository.existsByEmployeeIdAndOngoingTrueAndIdNot(1L, 10L)).thenReturn(true);

        assertThrows(ActiveContractExistsException.class,
                () -> contractService.update(10L, request(true)));
    }

    @Test
    @DisplayName("delete removes the contract from its employee")
    void deleteRemovesContract() {
        Contract contract = new Contract();
        contract.setId(10L);
        employee.addContract(contract);

        when(contractRepository.findById(10L)).thenReturn(Optional.of(contract));

        contractService.delete(10L);

        assertTrue(employee.getContracts().isEmpty());
    }
}