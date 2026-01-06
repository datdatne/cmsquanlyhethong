package com.example.cms_quanlyhethong.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="students")
public class Student {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private long id;
    @Column(name="student_code",length=20,unique=true,nullable=false)
    private String studentcode;
    @Column(name="full_name",length=100)
    private String fullname;
    @Column(name="date_of_birth")
    @Temporal(TemporalType.DATE)
    private Date dateofbirth;
    @Column(name="email",length=100,unique=true)
    private String email;
    @Column(name="phone",length=15,nullable=true)
    private String phone;
    @Column(name="address",length=255,nullable=true)
    private String address;
    @Column(name="major",length=100,nullable=true)
    private String major;
    @Column(name="class_name",length=50,nullable=true)
    private String classname;
    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="created_at",nullable=false)
    private Date createdAt;
    @Column(name="update_at",nullable=false)
    @Temporal(TemporalType.TIMESTAMP)
    @UpdateTimestamp
    private Date updatedAt;
    //mappedBy la inverse
    @OneToOne(mappedBy="student")
    private User user;
}
