package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MongoTestController {

    @Autowired
    private MongoTemplate mongoTemplate;

    @GetMapping("/api/test-mongo")
    public String testMongo() {
        if (mongoTemplate.getDb().getName().equals("LGApp")) {
            return "MongoDB connection is successful!";
        } else {
            return "MongoDB connection failed!";
        }
    }
}
