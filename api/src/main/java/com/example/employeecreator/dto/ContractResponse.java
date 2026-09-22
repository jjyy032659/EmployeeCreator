package com.example.employeecreator.dto;

import java.time.LocalDate;

import com.example.employeecreator.model.ContractType;
import com.example.employeecreator.model.EmploymentBasis;

public record ContractResponse(
        Long id,
        String position,
        String department,
        ContractType contractType,
        EmploymentBasis employmentBasis,
        LocalDate startDate,
        LocalDate finishDate,
        boolean ongoing,
        Integer hoursPerWeek) {
}