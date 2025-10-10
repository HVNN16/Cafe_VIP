//
//package com.cafe.cafe_backend.controller;
//
//import com.cafe.cafe_backend.model.Order;
//import com.cafe.cafe_backend.model.OrderItem;
//import com.cafe.cafe_backend.repo.OrderRepository;
//import com.cafe.cafe_backend.repo.TableRepository;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.ArrayList;
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/orders")
//@CrossOrigin(origins = "http://localhost:5173")
//public class OrderController {
//
//    private final OrderRepository orderRepo;
//    private final TableRepository tableRepo;
//
//    public OrderController(OrderRepository orderRepo, TableRepository tableRepo) {
//        this.orderRepo = orderRepo;
//        this.tableRepo = tableRepo;
//    }
//
//    // 🟢 USER / ADMIN xem đơn hàng theo bàn
//    @GetMapping("/table/{tableId}")
//    @PreAuthorize("hasAnyRole('USER','ADMIN')")
//    public List<Order> getOrdersByTable(@PathVariable String tableId) {
//        return orderRepo.findByTableId(tableId);
//    }
//
//    // 🟦 ADMIN xem toàn bộ đơn hàng
//    @GetMapping
//    @PreAuthorize("hasRole('ADMIN')")
//    public List<Order> getAllOrders() {
//        return orderRepo.findAll();
//    }
//
//    // 🟢 USER / ADMIN đặt món (tạo đơn mới)
//    @PostMapping
//    @PreAuthorize("hasAnyRole('USER','ADMIN')")
//    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
//        order.setStatus("pending");
//        double total = order.getItems().stream()
//                .mapToDouble(i -> i.getPrice() * i.getQuantity())
//                .sum();
//        order.setTotalPrice(total);
//
//        Order saved = orderRepo.save(order);
//
//        // ✅ Cập nhật trạng thái bàn → occupied
//        tableRepo.findById(order.getTableId()).ifPresent(t -> {
//            t.setStatus("occupied");
//            tableRepo.save(t);
//        });
//
//        return ResponseEntity.ok(saved);
//    }
//
//    // 🟡 ADMIN thêm món vào bàn đang phục vụ
//    @PutMapping("/table/{tableId}/add")
//    @PreAuthorize("hasRole('ADMIN')")
//    public ResponseEntity<?> addItemsToOrder(@PathVariable String tableId, @RequestBody List<OrderItem> newItems) {
//        List<Order> orders = orderRepo.findByTableId(tableId);
//        Order activeOrder = orders.stream()
//                .filter(o -> !"paid".equalsIgnoreCase(o.getStatus()))
//                .findFirst()
//                .orElse(null);
//
//        if (activeOrder == null) {
//            return ResponseEntity.status(404).body("Không tìm thấy đơn hàng đang phục vụ cho bàn này!");
//        }
//
//        List<OrderItem> items = new ArrayList<>(activeOrder.getItems());
//        for (OrderItem newItem : newItems) {
//            boolean exists = false;
//            for (OrderItem oldItem : items) {
//                if (oldItem.getProductId().equals(newItem.getProductId())) {
//                    oldItem.setQuantity(oldItem.getQuantity() + newItem.getQuantity());
//                    exists = true;
//                    break;
//                }
//            }
//            if (!exists) items.add(newItem);
//        }
//
//        // cập nhật tổng tiền
//        double newTotal = items.stream().mapToDouble(i -> i.getPrice() * i.getQuantity()).sum();
//        activeOrder.setItems(items);
//        activeOrder.setTotalPrice(newTotal);
//        orderRepo.save(activeOrder);
//
//        return ResponseEntity.ok(activeOrder);
//    }
//
//    // 🟢 ADMIN / USER cập nhật trạng thái đơn hàng (pending → served → paid)
//    @PutMapping("/{id}/status")
//    @PreAuthorize("hasAnyRole('USER','ADMIN')")
//    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestParam String status) {
//        return orderRepo.findById(id)
//                .map(order -> {
//                    order.setStatus(status);
//                    orderRepo.save(order);
//
//                    // Nếu đã thanh toán → bàn trở lại available
//                    if ("paid".equalsIgnoreCase(status)) {
//                        tableRepo.findById(order.getTableId()).ifPresent(t -> {
//                            t.setStatus("available");
//                            tableRepo.save(t);
//                        });
//                    }
//
//                    return ResponseEntity.ok(order);
//                })
//                .orElse(ResponseEntity.notFound().build());
//    }
//
//    // 🔵 Thanh toán đơn (phiên bản ngắn gọn)
//    @PutMapping("/{id}/pay")
//    @PreAuthorize("hasAnyRole('USER','ADMIN')")
//    public ResponseEntity<?> payOrder(@PathVariable String id) {
//        return orderRepo.findById(id)
//                .map(o -> {
//                    o.setStatus("paid");
//                    orderRepo.save(o);
//
//                    // Giải phóng bàn
//                    tableRepo.findById(o.getTableId()).ifPresent(t -> {
//                        t.setStatus("available");
//                        tableRepo.save(t);
//                    });
//
//                    return ResponseEntity.ok("✅ Thanh toán thành công");
//                })
//                .orElse(ResponseEntity.notFound().build());
//    }
//}
package com.cafe.cafe_backend.controller;

import com.cafe.cafe_backend.model.Order;
import com.cafe.cafe_backend.model.OrderItem;
import com.cafe.cafe_backend.repo.OrderRepository;
import com.cafe.cafe_backend.repo.TableRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderRepository orderRepo;
    private final TableRepository tableRepo;

    public OrderController(OrderRepository orderRepo, TableRepository tableRepo) {
        this.orderRepo = orderRepo;
        this.tableRepo = tableRepo;
    }

    // 🟢 USER / ADMIN xem đơn hàng theo bàn
    @GetMapping("/table/{tableId}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public List<Order> getOrdersByTable(@PathVariable String tableId) {
        return orderRepo.findByTableId(tableId);
    }

    // 🟦 ADMIN xem toàn bộ đơn hàng
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Order> getAllOrders() {
        return orderRepo.findAll();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        order.setStatus("pending");

        // ✅ Tính tổng tiền
        double total = order.getItems().stream()
                .mapToDouble(i -> i.getPrice() * i.getQuantity())
                .sum();
        order.setTotalPrice(total);

        // ✅ Gắn thông tin bàn
        tableRepo.findById(order.getTableId()).ifPresent(t -> {
            order.setTableNumber(String.valueOf(t.getTableNumber()));  // 🆕
            order.setTableLocation(t.getLocation());                   // 🆕
            t.setStatus("occupied");                                   // cập nhật trạng thái bàn
            tableRepo.save(t);
        });

        // ✅ Lưu đơn hàng sau khi có thông tin bàn
        Order saved = orderRepo.save(order);
        return ResponseEntity.ok(saved);
    }


    // 🟡 ADMIN thêm món vào bàn đang phục vụ
    @PutMapping("/table/{tableId}/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addItemsToOrder(@PathVariable String tableId, @RequestBody List<OrderItem> newItems) {
        List<Order> orders = orderRepo.findByTableId(tableId);
        Order activeOrder = orders.stream()
                .filter(o -> !"paid".equalsIgnoreCase(o.getStatus()))
                .findFirst()
                .orElse(null);

        if (activeOrder == null) {
            return ResponseEntity.status(404).body("Không tìm thấy đơn hàng đang phục vụ cho bàn này!");
        }

        List<OrderItem> items = new ArrayList<>(activeOrder.getItems());
        for (OrderItem newItem : newItems) {
            boolean exists = false;
            for (OrderItem oldItem : items) {
                if (oldItem.getProductId().equals(newItem.getProductId())) {
                    oldItem.setQuantity(oldItem.getQuantity() + newItem.getQuantity());
                    exists = true;
                    break;
                }
            }
            if (!exists) items.add(newItem);
        }

        // ✅ Cập nhật tổng tiền
        double newTotal = items.stream().mapToDouble(i -> i.getPrice() * i.getQuantity()).sum();
        activeOrder.setItems(items);
        activeOrder.setTotalPrice(newTotal);
        orderRepo.save(activeOrder);

        return ResponseEntity.ok(activeOrder);
    }

    // 🟢 ADMIN / USER cập nhật trạng thái đơn hàng (pending → served → paid)
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestParam String status) {
        return orderRepo.findById(id)
                .map(order -> {
                    order.setStatus(status);
                    orderRepo.save(order);

                    // ✅ Nếu đã thanh toán → bàn trở lại available
                    if ("paid".equalsIgnoreCase(status)) {
                        tableRepo.findById(order.getTableId()).ifPresent(t -> {
                            t.setStatus("available");
                            tableRepo.save(t);
                        });
                    }

                    return ResponseEntity.ok(order);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔵 Thanh toán đơn (phiên bản ngắn gọn)
    @PutMapping("/{id}/pay")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<?> payOrder(@PathVariable String id) {
        return orderRepo.findById(id)
                .map(o -> {
                    o.setStatus("paid");
                    orderRepo.save(o);

                    // ✅ Giải phóng bàn khi thanh toán xong
                    tableRepo.findById(o.getTableId()).ifPresent(t -> {
                        t.setStatus("available");
                        tableRepo.save(t);
                    });

                    return ResponseEntity.ok("✅ Thanh toán thành công");
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
