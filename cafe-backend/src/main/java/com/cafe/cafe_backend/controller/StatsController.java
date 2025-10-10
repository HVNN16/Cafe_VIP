package com.cafe.cafe_backend.controller;

import com.cafe.cafe_backend.model.Order;
import com.cafe.cafe_backend.repo.OrderRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "http://localhost:5173")
public class StatsController {

    private final OrderRepository orderRepo;

    public StatsController(OrderRepository orderRepo) {
        this.orderRepo = orderRepo;
    }

    // 📊 Tổng quan
    @GetMapping("/overview")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Object> getOverview() {
        List<Order> all = orderRepo.findAll();

        double totalRevenue = all.stream()
                .filter(o -> "paid".equalsIgnoreCase(o.getStatus()))
                .mapToDouble(Order::getTotalPrice)
                .sum();

        long totalOrders = all.size();
        long totalPaid = all.stream().filter(o -> "paid".equalsIgnoreCase(o.getStatus())).count();

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("totalRevenue", totalRevenue);
        res.put("totalOrders", totalOrders);
        res.put("totalPaidOrders", totalPaid);
        return res;
    }

    // 📅 Doanh thu theo ngày
    @GetMapping("/daily")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Map<String, Object>> getDailyRevenue() {
        List<Order> all = orderRepo.findAll();

        Map<LocalDate, Double> grouped = all.stream()
                .filter(o -> o.getCreatedAt() != null && "paid".equalsIgnoreCase(o.getStatus()))
                .collect(Collectors.groupingBy(
                        o -> o.getCreatedAt().toLocalDate(),
                        Collectors.summingDouble(Order::getTotalPrice)
                ));

        List<Map<String, Object>> result = new ArrayList<>();

        grouped.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .forEach(e -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("date", e.getKey().toString());
                    map.put("revenue", e.getValue());
                    result.add(map);
                });

        return result;
    }


    // ☕ Top món bán chạy
    @GetMapping("/top-products")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Map<String, Object>> getTopProducts() {
        List<Order> all = orderRepo.findAll();
        Map<String, Integer> countMap = new HashMap<>();

        all.stream()
                .filter(o -> o.getItems() != null)
                .forEach(o -> o.getItems().forEach(i -> {
                    countMap.merge(i.getName(), i.getQuantity(), Integer::sum);
                }));

        return countMap.entrySet().stream()
                .sorted((a, b) -> b.getValue() - a.getValue())
                .limit(5)
                .map(e -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", e.getKey());
                    map.put("quantity", e.getValue());
                    return map;
                })
                .collect(Collectors.toList());
    }
}
