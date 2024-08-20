package com.example.demo.repository;

import com.example.demo.entity.Leads;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LeadsRepository extends MongoRepository<Leads, String> {
}
