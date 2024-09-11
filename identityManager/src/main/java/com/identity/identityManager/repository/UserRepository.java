package com.identity.identityManager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.identity.identityManager.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}
