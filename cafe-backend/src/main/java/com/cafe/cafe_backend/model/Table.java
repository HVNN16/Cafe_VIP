package com.cafe.cafe_backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.bson.types.ObjectId;

@Document(collection = "tables")
public class Table {

    @Id
    @JsonProperty("id") // ✅ giúp JSON trả về là "id" thay vì "_id"
    private ObjectId id;

    private int tableNumber;
    private int capacity;
    private String location;
    private String status;

    public Table() {}

    public Table(int tableNumber, int capacity, String location, String status) {
        this.tableNumber = tableNumber;
        this.capacity = capacity;
        this.location = location;
        this.status = status;
    }

    // ✅ Getter/Setter
    public String getId() {
        return id != null ? id.toHexString() : null; // convert sang String để React dễ xử lý
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public int getTableNumber() { return tableNumber; }
    public void setTableNumber(int tableNumber) { this.tableNumber = tableNumber; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
