package com.example.employeecreator.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.example.employeecreator.dto.CreateEmployeeRequest;
import com.example.employeecreator.model.ContractType;
import com.example.employeecreator.model.Employee;
import com.example.employeecreator.model.EmploymentBasis;
import com.example.employeecreator.repository.EmployeeRepository;
import tools.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
class EmployeeControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private EmployeeRepository employeeRepository;

    @BeforeEach
    void setUp() {
        employeeRepository.deleteAll();
    }

    private Employee saveEmployee() {
        Employee employee = new Employee();
        employee.setFirstName("John");
        employee.setLastName("Smith");
        employee.setEmail("john.smith@email.com");
        employee.setMobileNumber("+61412345678");
        employee.setAddress("123 Example St, Sydney NSW 2000");
        employee.setContractType(ContractType.PERMANENT);
        employee.setStartDate(LocalDate.of(2021, 7, 28));
        employee.setOngoing(true);
        employee.setEmploymentBasis(EmploymentBasis.FULL_TIME);
        employee.setHoursPerWeek(38);
        return employeeRepository.save(employee);
    }

    private CreateEmployeeRequest validRequest() {
        CreateEmployeeRequest request = new CreateEmployeeRequest();
        request.setFirstName("Tessa");
        request.setLastName("Antonia");
        request.setEmail("tessa.antonia@email.com");
        request.setMobileNumber("+61423456789");
        request.setAddress("45 Sample Rd, Melbourne VIC 3000");
        request.setContractType(ContractType.CONTRACT);
        request.setStartDate(LocalDate.of(2016, 3, 15));
        request.setOngoing(true);
        request.setEmploymentBasis(EmploymentBasis.PART_TIME);
        request.setHoursPerWeek(20);
        return request;
    }

    @Test
    @DisplayName("GET /employees returns the list of employees")
    void getAllReturnsEmployees() throws Exception {
        saveEmployee();

        mockMvc.perform(get("/employees"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].firstName").value("John"));
    }

    @Test
    @DisplayName("GET /employees/{id} returns 404 when the employee does not exist")
    void getByIdReturnsNotFound() throws Exception {
        mockMvc.perform(get("/employees/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    @DisplayName("POST /employees creates an employee")
    void postCreatesEmployee() throws Exception {
        String json = objectMapper.writeValueAsString(validRequest());

        mockMvc.perform(post("/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.firstName").value("Tessa"));
    }

    @Test
    @DisplayName("POST /employees returns 400 with field errors when invalid")
    void postReturnsBadRequestWhenInvalid() throws Exception {
        CreateEmployeeRequest request = validRequest();
        request.setFirstName("");
        request.setEmail("not-an-email");

        String json = objectMapper.writeValueAsString(request);

        mockMvc.perform(post("/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.firstName").exists())
                .andExpect(jsonPath("$.errors.email").exists());
    }

    @Test
    @DisplayName("DELETE /employees/{id} removes the employee")
    void deleteRemovesEmployee() throws Exception {
        Employee saved = saveEmployee();

        mockMvc.perform(delete("/employees/" + saved.getId()))
                .andExpect(status().isOk());

        mockMvc.perform(get("/employees"))
                .andExpect(jsonPath("$.length()").value(0));
    }
}