package com.example.employeecreator.model;
import jakarta.persistence.*;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import java.time.LocalDate;
@Entity
@Table(name="employees")
public class Employee {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @Column(nullable=false, length=50)
    private String firstName;
    @Column(length=50)
    private String middleName;
    @Column(nullable=false,length=50)
    private String lastName;
    @Column(nullable=false,unique=true,length=255)
    private String email;
    @Column(nullable=false,length=20)
    private String mobileNumber;
    @Column(nullable=false,length=255)
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false,length=20)
    private ContractType ContractType;
    
    @Column(nullable=false)
    private LocalDate startDate;


}
