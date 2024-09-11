package com.example.demo.repository;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
@Repository
public class CustomLeadsRepositoryImpl implements CustomLeadsRepository {
    @Autowired
    private MongoTemplate mongoTemplate;
    @Override
    public List<Document> aggregate(List<Document> pipeline) {
        return mongoTemplate.getCollection("Leads").aggregate(pipeline).into(new ArrayList<>());
    }
}
