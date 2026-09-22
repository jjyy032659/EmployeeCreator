package com.example.employeecreator.exception;

public class ContractNotFoundException extends RuntimeException {

    public ContractNotFoundException(Long id) {
        super("Contract not found with id: " + id);
    }
}