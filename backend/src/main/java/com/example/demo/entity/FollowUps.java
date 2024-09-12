package com.example.demo.entity;

import java.time.LocalDate;

public class FollowUps {

    private LocalDate followupDate;
    private String callNotes;


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

}