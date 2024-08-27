package com.example.demo.entity;

import java.time.LocalDateTime;
import java.util.List;

public class CallSchedules {

    private LocalDateTime callDate;
    private String notes;
    private String leadCompanyName;
    private String coordinatorName;
    private String devName;
    private String callCategory;
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
