package com.example.demo.entity;

import java.time.LocalDateTime;
import java.util.List;

public class CallSchedules {

    public CallStatus getCallStatus() {
        return callStatus;
    }

    public void setCallStatus(CallStatus callStatus) {
        this.callStatus = callStatus;
    }

    public String getCoordinatorEmail() {
        return coordinatorEmail;
    }

    public void setCoordinatorEmail(String coordinatorEmail) {
        this.coordinatorEmail = coordinatorEmail;
    }

    public String getLeadCompanyEmail() {
        return leadCompanyEmail;
    }

    public void setLeadCompanyEmail(String leadCompanyEmail) {
        this.leadCompanyEmail = leadCompanyEmail;
    }

    public enum CallStatus {
        MISSED,
        TAKEN
    }

    private LocalDateTime callDate;
    private String notes;
    private String leadCompanyName;
    private String leadCompanyEmail;
    private String coordinatorName;
    private String coordinatorEmail;
    private String devName;
    private String callCategory;
    private CallStatus callStatus;
    private List<FollowUps> followUps;


    public LocalDateTime getCallDate() {
        return callDate;
    }

    public void setCallDate(LocalDateTime callDate) {
        this.callDate = callDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getLeadCompanyName() {
        return leadCompanyName;
    }

    public void setLeadCompanyName(String leadCompanyName) {
        this.leadCompanyName = leadCompanyName;
    }

    public String getDevName() {
        return devName;
    }

    public void setDevName(String devName) {
        this.devName = devName;
    }

    public String getCallCategory() {
        return callCategory;
    }

    public void setCallCategory(String callCategory) {
        this.callCategory = callCategory;
    }

    public List<FollowUps> getFollowUps() {
        return followUps;
    }

    public void setFollowUps(List<FollowUps> followUps) {
        this.followUps = followUps;
    }

    public String getCoordinatorName() {
        return coordinatorName;
    }

    public void setCoordinatorName(String coordinatorName) {
        this.coordinatorName = coordinatorName;
    }
}
