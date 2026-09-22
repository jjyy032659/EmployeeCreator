package com.example.employeecreator.dto;

import java.time.LocalDate;

import com.example.employeecreator.model.ContractType;
import com.example.employeecreator.model.EmploymentBasis;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ContractRequest {

    @NotBlank(message = "Position is required")
    @Size(max = 100, message = "Position must be 100 characters or fewer")
    private String position;

    @NotBlank(message = "Department is required")
    @Size(max = 100, message = "Department must be 100 characters or fewer")
    private String department;

    @NotNull(message = "Contract type is required")
    private ContractType contractType;

    @NotNull(message = "Employment basis is required")
    private EmploymentBasis employmentBasis;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    private LocalDate finishDate;

    private boolean ongoing;

    @NotNull(message = "Hours per week is required")
    @Min(value = 1, message = "Hours per week must be at least 1")
    @Max(value = 168, message = "Hours per week cannot exceed 168")
    private Integer hoursPerWeek;

    public ContractRequest() {
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public ContractType getContractType() {
        return contractType;
    }

    public void setContractType(ContractType contractType) {
        this.contractType = contractType;
    }

    public EmploymentBasis getEmploymentBasis() {
        return employmentBasis;
    }

    public void setEmploymentBasis(EmploymentBasis employmentBasis) {
        this.employmentBasis = employmentBasis;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getFinishDate() {
        return finishDate;
    }

    public void setFinishDate(LocalDate finishDate) {
        this.finishDate = finishDate;
    }

    public boolean isOngoing() {
        return ongoing;
    }

    public void setOngoing(boolean ongoing) {
        this.ongoing = ongoing;
    }

    public Integer getHoursPerWeek() {
        return hoursPerWeek;
    }

    public void setHoursPerWeek(Integer hoursPerWeek) {
        this.hoursPerWeek = hoursPerWeek;
    }
}