package com.example.employeecreator.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.employeecreator.dto.EmployeeResponse;
import com.example.employeecreator.exception.EmployeeNotFoundException;
import com.example.employeecreator.mapper.EmployeeMapper;
import com.example.employeecreator.model.Employee;
import com.example.employeecreator.repository.EmployeeRepository;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    private EmployeeService employeeService;
    private Employee employee;

    @BeforeEach
    void setUp() {
        employeeService = new EmployeeService(employeeRepository, new EmployeeMapper());

        employee = new Employee();
        employee.setId(1L);
        employee.setFirstName("John");
        employee.setLastName("Smith");
        employee.setEmail("john.smith@email.com");
    }

    @Test
    @DisplayName("findAll returns every employee as a response")
    void findAllReturnsAllEmployees() {
        when(employeeRepository.findAllWithContracts()).thenReturn(List.of(employee));

        List<EmployeeResponse> result = employeeService.findAll();

        assertEquals(1, result.size());
        assertEquals("John", result.get(0).firstName());
    }

    @Test
    @DisplayName("findById returns the employee when it exists")
    void findByIdReturnsEmployee() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));

        EmployeeResponse result = employeeService.findById(1L);

        assertEquals("John", result.firstName());
    }

    @Test
    @DisplayName("findById throws when the employee does not exist")
    void findByIdThrowsWhenMissing() {
        when(employeeRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(EmployeeNotFoundException.class, () -> employeeService.findById(999L));
    }

    @Test
    @DisplayName("delete removes the employee when it exists")
    void deleteRemovesEmployee() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));

        employeeService.delete(1L);

        verify(employeeRepository).delete(employee);
    }

    @Test
    @DisplayName("delete throws and does not touch the repository when missing")
    void deleteThrowsWhenMissing() {
        when(employeeRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(EmployeeNotFoundException.class, () -> employeeService.delete(999L));

        verify(employeeRepository, never()).delete(any());
    }
}