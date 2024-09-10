package com.identity.manager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.identity.manager.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}
