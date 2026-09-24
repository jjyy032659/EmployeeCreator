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

import com.example.employeecreator.model.Contract;
import com.example.employeecreator.model.ContractType;
import com.example.employeecreator.model.Employee;
import com.example.employeecreator.model.EmploymentBasis;
import com.example.employeecreator.repository.EmployeeRepository;

@SpringBootTest
@AutoConfigureMockMvc
class EmployeeControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private EmployeeRepository employeeRepository;

    @BeforeEach
    void setUp() {
        employeeRepository.deleteAll();
    }

    private Employee saveEmployeeWithContract() {
        Employee employee = new Employee();
        employee.setFirstName("John");
        employee.setLastName("Smith");
        employee.setEmail("john.smith@email.com");
        employee.setMobileNumber("0412345678");
        employee.setAddress("123 Example St, Sydney NSW 2000");

        Contract contract = new Contract();
        contract.setPosition("Mid Developer");
        contract.setDepartment("Technology");
        contract.setContractType(ContractType.PERMANENT);
        contract.setEmploymentBasis(EmploymentBasis.FULL_TIME);
        contract.setStartDate(LocalDate.of(2021, 7, 1));
        contract.setOngoing(true);
        contract.setHoursPerWeek(38);

        employee.addContract(contract);
        return employeeRepository.save(employee);
    }

    private String employeeJson() {
        return """
                {
                  "firstName": "Tessa",
                  "middleName": null,
                  "lastName": "Antonia",
                  "email": "tessa.antonia@email.com",
                  "mobileNumber": "0423456789",
                  "address": "45 Sample Rd, Melbourne VIC 3000"
                }
                """;
    }

    private String contractJson(boolean ongoing) {
        return """
                {
                  "position": "Junior Developer",
                  "department": "Technology",
                  "contractType": "PERMANENT",
                  "employmentBasis": "FULL_TIME",
                  "startDate": "2019-02-01",
                  "finishDate": %s,
                  "ongoing": %s,
                  "hoursPerWeek": 38
                }
                """.formatted(ongoing ? "null" : "\"2021-06-30\"", ongoing);
    }

    @Test
    @DisplayName("GET /employees returns employees with their contracts")
    void getAllReturnsEmployeesWithContracts() throws Exception {
        saveEmployeeWithContract();

        mockMvc.perform(get("/employees"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].firstName").value("John"))
                .andExpect(jsonPath("$[0].contracts.length()").value(1))
                .andExpect(jsonPath("$[0].contracts[0].position").value("Mid Developer"));
    }

    @Test
    @DisplayName("GET /employees/{id} returns 404 when the employee does not exist")
    void getByIdReturnsNotFound() throws Exception {
        mockMvc.perform(get("/employees/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    @DisplayName("POST /employees creates an employee with no contracts")
    void postCreatesEmployee() throws Exception {
        mockMvc.perform(post("/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(employeeJson()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.firstName").value("Tessa"))
                .andExpect(jsonPath("$.contracts.length()").value(0));
    }

    @Test
    @DisplayName("POST /employees returns 400 with field errors when invalid")
    void postReturnsBadRequestWhenInvalid() throws Exception {
        String json = """
                {
                  "firstName": "",
                  "lastName": "Antonia",
                  "email": "not-an-email",
                  "mobileNumber": "0423456789",
                  "address": "45 Sample Rd"
                }
                """;

        mockMvc.perform(post("/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.firstName").exists())
                .andExpect(jsonPath("$.errors.email").exists());
    }

    @Test
    @DisplayName("POST /employees/{id}/contracts adds a contract")
    void postAddsContract() throws Exception {
        Employee saved = saveEmployeeWithContract();

        mockMvc.perform(post("/employees/" + saved.getId() + "/contracts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(contractJson(false)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.position").value("Junior Developer"));

        mockMvc.perform(get("/employees/" + saved.getId()))
                .andExpect(jsonPath("$.contracts.length()").value(2));
    }

    @Test
    @DisplayName("POST /employees/{id}/contracts returns 409 for a second ongoing contract")
    void postRejectsSecondOngoingContract() throws Exception {
        Employee saved = saveEmployeeWithContract();

        mockMvc.perform(post("/employees/" + saved.getId() + "/contracts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(contractJson(true)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409));
    }

    @Test
    @DisplayName("DELETE /employees/{id} removes the employee and its contracts")
    void deleteRemovesEmployee() throws Exception {
        Employee saved = saveEmployeeWithContract();

        mockMvc.perform(delete("/employees/" + saved.getId()))
                .andExpect(status().isOk());

        mockMvc.perform(get("/employees"))
                .andExpect(jsonPath("$.length()").value(0));
    }
}