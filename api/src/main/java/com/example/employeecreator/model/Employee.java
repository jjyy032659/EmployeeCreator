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

    private LocalDate finishDate;

    @Column(nullable=false)
    private boolean ongoing;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false,length=20)
    private EmploymentBasis employmentBasis;

    @Column(nullable=false)
    private Integer hoursPerWeek;

    public Employee() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getMiddleName() {
        return middleName;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public ContractType getContractType() {
        return ContractType;
    }

    public void setContractType(ContractType contractType) {
        ContractType = contractType;
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

    public EmploymentBasis getEmploymentBasis() {
        return employmentBasis;
    }

    public void setEmploymentBasis(EmploymentBasis employmentBasis) {
        this.employmentBasis = employmentBasis;
    }

    public Integer getHoursPerWeek() {
        return hoursPerWeek;
    }

    public void setHoursPerWeek(Integer hoursPerWeek) {
        this.hoursPerWeek = hoursPerWeek;
    }
}
