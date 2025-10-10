////package com.cafe.cafe_backend.model;
////
////import org.springframework.data.annotation.Id;
////import org.springframework.data.mongodb.core.mapping.Document;
////import java.util.List;
////
////@Document(collection = "orders")
////public class Order {
////
////    @Id
////    private String id;
////    private String tableId;
////    private List<Item> items;
////    private double totalPrice;
////    private String status; // pending | served | paid
////
////    public static class Item {
////        private String productId;
////        private String name;
////        private int quantity;
////        private double price;
////
////        public String getProductId() { return productId; }
////        public void setProductId(String productId) { this.productId = productId; }
////        public String getName() { return name; }
////        public void setName(String name) { this.name = name; }
////        public int getQuantity() { return quantity; }
////        public void setQuantity(int quantity) { this.quantity = quantity; }
////        public double getPrice() { return price; }
////        public void setPrice(double price) { this.price = price; }
////    }
////
////    public String getId() { return id; }
////    public String getTableId() { return tableId; }
////    public void setTableId(String tableId) { this.tableId = tableId; }
////    public List<Item> getItems() { return items; }
////    public void setItems(List<Item> items) { this.items = items; }
////    public double getTotalPrice() { return totalPrice; }
////    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }
////    public String getStatus() { return status; }
////    public void setStatus(String status) { this.status = status; }
////}
//package com.cafe.cafe_backend.model;
//
//import org.springframework.data.annotation.Id;
//import org.springframework.data.mongodb.core.mapping.Document;
//import java.util.List;
//
//@Document(collection = "orders")
//public class Order {
//    @Id
//    private String id;
//    private String tableId;
//    private List<OrderItem> items;
//    private String status; // pending | served | paid
//    private double totalPrice;
//
//    // ✅ Getter / Setter
//    public String getId() {
//        return id;
//    }
//
//    public void setId(String id) {
//        this.id = id;
//    }
//
//    public String getTableId() {
//        return tableId;
//    }
//
//    public void setTableId(String tableId) {
//        this.tableId = tableId;
//    }
//
//    public List<OrderItem> getItems() {
//        return items;
//    }
//
//    public void setItems(List<OrderItem> items) {
//        this.items = items;
//    }
//
//    public String getStatus() {
//        return status;
//    }
//
//    public void setStatus(String status) {
//        this.status = status;
//    }
//
//    public double getTotalPrice() {
//        return totalPrice;
//    }
//
//    public void setTotalPrice(double totalPrice) {
//        this.totalPrice = totalPrice;
//    }
//}
package com.cafe.cafe_backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    private String tableId;
    private String tableNumber;       // 🆕
    private String tableLocation;     // 🆕
    private LocalDateTime createdAt = LocalDateTime.now(); // 🆕
    private List<OrderItem> items;
    private double totalPrice;
    private String status;

    // Getter/Setter
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTableId() { return tableId; }
    public void setTableId(String tableId) { this.tableId = tableId; }

    public String getTableNumber() { return tableNumber; }
    public void setTableNumber(String tableNumber) { this.tableNumber = tableNumber; }

    public String getTableLocation() { return tableLocation; }
    public void setTableLocation(String tableLocation) { this.tableLocation = tableLocation; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }

    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
