package com.example.demo.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.util.List;

@Document(collection = "Leads")
public class Leads {

    public String getCoordinatorName() {
        return coordinatorName;
    }

    public void setCoordinatorName(String coordinatorName) {
        this.coordinatorName = coordinatorName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public enum Status {
        NEW,
        IN_PROGRESS,
        COMPLETED,
        CLOSED
    }

    @Id
    private String id;
    private LocalDate firstContactDate;
    private String companyName;
    private String inviterName;
    private String techStackName;
    private String bdName;
    private String devName;
    private String profileName;
    private String coordinatorName;
    private Status status;
    private String description;
    private String userId;
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    private List<CallSchedules> callSchedules;


    public Leads() {
        this.firstContactDate = LocalDate.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public LocalDate getFirstContactDate() {
        return firstContactDate;
    }

    public void setFirstContactDate(LocalDate firstContactDate) {
        this.firstContactDate = firstContactDate;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getInviterName() {
        return inviterName;
    }

    public void setInviterName(String inviterName) {
        this.inviterName = inviterName;
    }

    public String getTechStackName() {
        return techStackName;
    }

    public void setTechStackName(String techStackName) {
        this.techStackName = techStackName;
    }

    public String getBdName() {
        return bdName;
    }

    public void setBdName(String bdName) {
        this.bdName = bdName;
    }

    public String getProfileName() {
        return profileName;
    }

    public void setProfileName(String profileName) {
        this.profileName = profileName;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getDevName() {
        return devName;
    }

    public void setDevName(String devName) {
        this.devName = devName;
    }

    public List<CallSchedules> getCallSchedules() {
        return callSchedules;
    }

    public void setCallSchedules(List<CallSchedules> callSchedules) {
        this.callSchedules = callSchedules;
    }
}
