package com.example.employeecreator.controller;


import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.employeecreator.model.Employee;
import com.example.employeecreator.service.EmployeeService;


@RestController
@RequestMapping("/employees")
public class EmployeeController {
private final EmployeeService employeeService;

public EmployeeController(EmployeeService employeeService){
    this.employeeService=employeeService;
}

    @GetMapping
    public List<Employee>  findAll(){
        return employeeService.findAll();
    }
}
