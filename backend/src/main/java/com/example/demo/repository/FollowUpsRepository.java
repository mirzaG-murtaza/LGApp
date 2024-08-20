package com.example.demo.repository;

import com.example.demo.entity.FollowUps;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FollowUpsRepository extends MongoRepository<FollowUps, String> {
}
