package com.example.employeecreator.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.employeecreator.model.Contract;

public interface ContractRepository extends JpaRepository<Contract, Long> {

    boolean existsByEmployeeIdAndOngoingTrue(Long employeeId);

    boolean existsByEmployeeIdAndOngoingTrueAndIdNot(Long employeeId, Long id);
}