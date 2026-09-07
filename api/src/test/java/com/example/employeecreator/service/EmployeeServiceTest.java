package com.example.employeecreator.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.employeecreator.exception.EmployeeNotFoundException;
import com.example.employeecreator.mapper.EmployeeMapper;
import com.example.employeecreator.model.ContractType;
import com.example.employeecreator.model.Employee;
import com.example.employeecreator.model.EmploymentBasis;
import com.example.employeecreator.repository.EmployeeRepository;

@ExtendWith (MockitoExtension.class)
public class EmployeeServiceTest {
    @Mock 
    private EmployeeRepository employeeRepository;
    @Mock 
    private EmployeeMapper employeeMapper;
    @InjectMocks
    private EmployeeService employeeService;
    
    private Employee employee;

    @BeforeEach 
    void setUp(){
       employee = new Employee();
        employee.setId(1L);
        employee.setFirstName("John");
        employee.setLastName("Smith");
        employee.setEmail("john.smith@email.com");
        employee.setContractType(ContractType.PERMANENT);
        employee.setEmploymentBasis(EmploymentBasis.FULL_TIME);
        employee.setHoursPerWeek(38);
    }

    @Test 
    @DisplayName("findAll returns every employee from the repository")
    void findAllReturnsAllEmployees(){
        when(employeeRepository.findAll()).thenReturn(List.of(employee));
        List<Employee> result= employeeService.findAll();
        assertEquals(1,result.size());
        assertEquals("John", result.get(0).getFirstName());
    }

    @Test
    @DisplayName("findById returns the employee when it exists")
    void findByIdReturnsEmployee() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));

        Employee result = employeeService.findById(1L);

        assertEquals("John", result.getFirstName());
    }

  @Test
    @DisplayName("findById throws when the employee does not exist")
    void findByIdThrowsWhenMissing() {
        when(employeeRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(EmployeeNotFoundException.class,
                () -> employeeService.findById(999L));
    }

    @Test
    @DisplayName("delete removes the employee when it exists")
    void deleteRemovesEmployee() {
        when(employeeRepository.existsById(1L)).thenReturn(true);

        employeeService.delete(1L);

        verify(employeeRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("delete throws and does not call the repository when missing")
    void deleteThrowsWhenMissing() {
        when(employeeRepository.existsById(999L)).thenReturn(false);

        assertThrows(EmployeeNotFoundException.class,
                () -> employeeService.delete(999L));

        verify(employeeRepository, never()).deleteById(any());
    }
}
