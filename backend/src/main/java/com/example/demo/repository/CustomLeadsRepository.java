package com.example.demo.repository;

import org.bson.Document;
import java.util.List;

public interface CustomLeadsRepository {
    List<Document> aggregate(List<Document> pipeline);
}
