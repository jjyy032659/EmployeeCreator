package com.example.employeecreator.dto;

import java.util.List;

public record EmployeeResponse(
        Long id,
        String firstName,
        String middleName,
        String lastName,
        String email,
        String mobileNumber,
        String address,
        List<ContractResponse> contracts) {
}