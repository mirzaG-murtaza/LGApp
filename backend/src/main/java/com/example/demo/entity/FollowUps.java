package com.example.demo.entity;

import java.time.LocalDate;

public class FollowUps {

    public enum Status {
        NEW,
        IN_PROGRESS,
        COMPLETED,
        CLOSED
    }

    private LocalDate followupDate;
    private String callNotes;
    private Status status;


    public LocalDate getFollowupDate() {
        return followupDate;
    }

    public void setFollowupDate(LocalDate followupDate) {
        this.followupDate = followupDate;
    }

    public String getCallNotes() {
        return callNotes;
    }

    public void setCallNotes(String callNotes) {
        this.callNotes = callNotes;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}