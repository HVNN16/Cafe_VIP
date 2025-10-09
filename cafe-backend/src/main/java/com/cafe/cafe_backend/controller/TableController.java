package com.cafe.cafe_backend.controller;

import com.cafe.cafe_backend.model.Table;
import com.cafe.cafe_backend.repo.TableRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
@CrossOrigin(origins = "http://localhost:5173")
public class TableController {
    private final TableRepository tableRepo;

    public TableController(TableRepository tableRepo) {
        this.tableRepo = tableRepo;
    }

    // ✅ ADMIN xem tất cả bàn
    @GetMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public List<Table> getAll() {
        return tableRepo.findAll();
    }

    // ✅ USER xem bàn trống
    @GetMapping("/available")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public List<Table> getAvailable() {
        return tableRepo.findByStatus("available");
    }

    // ✅ ADMIN thêm bàn
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Table addTable(@RequestBody Table t) {
        if (t.getStatus() == null || t.getStatus().isEmpty()) t.setStatus("available");
        return tableRepo.save(t);
    }

    // ✅ ADMIN cập nhật bàn
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Table> update(@PathVariable String id, @RequestBody Table update) {
        return tableRepo.findById(id)
                .map(t -> {
                    t.setTableNumber(update.getTableNumber());
                    t.setCapacity(update.getCapacity());
                    t.setLocation(update.getLocation());
                    t.setStatus(update.getStatus());
                    tableRepo.save(t);
                    return ResponseEntity.ok(t);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ ADMIN xóa bàn
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (tableRepo.existsById(id)) {
            tableRepo.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // ✅ USER chọn bàn
    @PutMapping("/{id}/occupy")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<?> occupy(@PathVariable String id) {
        return tableRepo.findById(id)
                .map(t -> {
                    if ("available".equalsIgnoreCase(t.getStatus())) {
                        t.setStatus("occupied");
                        tableRepo.save(t);
                        return ResponseEntity.ok(t);
                    } else {
                        return ResponseEntity.status(400).body("Bàn này đã có người phục vụ!");
                    }
                })
                .orElse(ResponseEntity.status(404).body("Không tìm thấy bàn!"));
    }

    // ✅ ADMIN hoặc USER có thể reset bàn (về trạng thái trống)
    @PutMapping("/{id}/reset")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> resetTable(@PathVariable String id) {
        return tableRepo.findById(id)
                .<ResponseEntity<?>>map(t -> {
                    t.setStatus("available");
                    tableRepo.save(t);
                    return ResponseEntity.ok(t);
                })
                .orElse(ResponseEntity.status(404).body("Không tìm thấy bàn!"));
    }
}
