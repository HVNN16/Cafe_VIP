package com.cafe.cafe_backend.repo;

import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.cafe.cafe_backend.model.User;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
