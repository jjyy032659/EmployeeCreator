package com.example.employeecreator.exception;

public class ActiveContractExistsException extends RuntimeException {

    public ActiveContractExistsException(Long employeeId) {
        super("Employee " + employeeId
                + " already has an ongoing contract. End it before adding another.");
    }
}