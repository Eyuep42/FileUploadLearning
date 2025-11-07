package org.demo.imgscan.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Owner {
    @Id
    private Long id;
    private String name;
}
