package com.cafe.cafe_backend.repo;

import com.cafe.cafe_backend.model.Table;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TableRepository extends MongoRepository<Table, String> {
    List<Table> findByStatus(String status);
}
