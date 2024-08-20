package com.example.demo.repository;

import com.example.demo.entity.CallSchedules;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CallSchedulesRepository extends MongoRepository<CallSchedules, String> {
}
