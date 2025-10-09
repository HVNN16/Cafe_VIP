package com.cafe.cafe_backend.controller;

import com.cafe.cafe_backend.model.Order;
import com.cafe.cafe_backend.repo.OrderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {
    private final OrderRepository orderRepo;

    public OrderController(OrderRepository orderRepo) {
        this.orderRepo = orderRepo;
    }

    // 🟢 USER/ADMIN tạo đơn hàng
    @PostMapping
    @PreAuthorize("hasAnyAuthority('USER','ADMIN')")
    public Order createOrder(@RequestBody Order order) {
        double total = order.getItems().stream()
                .mapToDouble(i -> i.getPrice() * i.getQuantity())
                .sum();
        order.setTotal(total);
        order.setStatus("serving");
        return orderRepo.save(order);
    }

    // 🧾 ADMIN xem tất cả đơn
    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<Order> getAll() {
        return orderRepo.findAll();
    }

    // 🔍 Xem đơn theo bàn
    @GetMapping("/table/{tableId}")
    @PreAuthorize("hasAnyAuthority('USER','ADMIN')")
    public List<Order> getByTable(@PathVariable String tableId) {
        return orderRepo.findByTableId(tableId);
    }

    // 🟢 ADMIN cập nhật trạng thái (paid / canceled)
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestParam String status) {
        return orderRepo.findById(id)
                .map(o -> {
                    o.setStatus(status);
                    orderRepo.save(o);
                    return ResponseEntity.ok(o);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ❌ ADMIN xóa đơn
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> deleteOrder(@PathVariable String id) {
        if (!orderRepo.existsById(id)) return ResponseEntity.notFound().build();
        orderRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
