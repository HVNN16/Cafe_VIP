package com.cafe.cafe_backend.repo;

import com.cafe.cafe_backend.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByStatus(String status);
    List<Order> findByTableId(String tableId);
}
