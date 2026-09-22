package com.example.employeecreator.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.employeecreator.dto.ContractRequest;
import com.example.employeecreator.dto.ContractResponse;
import com.example.employeecreator.service.ContractService;

import jakarta.validation.Valid;

@RestController
public class ContractController {

    private final ContractService contractService;

    public ContractController(ContractService contractService) {
        this.contractService = contractService;
    }

    @GetMapping("/employees/{employeeId}/contracts")
    public List<ContractResponse> findByEmployee(@PathVariable Long employeeId) {
        return contractService.findByEmployee(employeeId);
    }

    @PostMapping("/employees/{employeeId}/contracts")
    public ContractResponse create(@PathVariable Long employeeId,
                                   @Valid @RequestBody ContractRequest request) {
        return contractService.create(employeeId, request);
    }

    @PutMapping("/contracts/{id}")
    public ContractResponse update(@PathVariable Long id,
                                   @Valid @RequestBody ContractRequest request) {
        return contractService.update(id, request);
    }

    @DeleteMapping("/contracts/{id}")
    public void delete(@PathVariable Long id) {
        contractService.delete(id);
    }
}