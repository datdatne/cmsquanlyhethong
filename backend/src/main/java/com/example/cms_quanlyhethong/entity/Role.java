package com.example.cms_quanlyhethong.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity()
@Table(name="roles")
public class Role {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id ;
    @Column(name="name",nullable=false,length=50,unique=true)
    private String name;
    @Column(name="description",nullable=true,length=255)
    private String description;
    @Column(name="created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
 // Quan he Many to Many voi bang User
    @ManyToMany(mappedBy="roles")
    // Dinh nghia ben kia user
    @JsonIgnore
    private Set<User> user = new HashSet<>();

}
