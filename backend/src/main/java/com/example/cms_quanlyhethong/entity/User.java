package com.example.cms_quanlyhethong.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="users")
@Getter
@Setter // Tự động tạo getter/setter, toString, equals, hashCode
@NoArgsConstructor  // Constructor không tham số
@AllArgsConstructor  // Constructor với tất cả tham số
public class User {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @Column(name="username",length=255,unique=true,nullable=false)
    private String username;
    @Column(name = "password",unique =true, nullable = false, length = 255)
    @JsonIgnore
    private String password;
    @Column(name = "email",  nullable = false, length = 100)
    private String email;
    @Column(name = "full_name", length = 100)
    private String fullname;
    @Column(name = "is_active", nullable = false)
    private boolean isActive=true;
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    @UpdateTimestamp
    @Column(name = "update_at", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name="user_roles",
            joinColumns=@JoinColumn(name="user_id"),
            inverseJoinColumns=@JoinColumn(name="role_id")
    )
    @JsonIgnore
    private Set<Role> roles = new HashSet<>();
    @OneToOne
    @JoinColumn(name="user")
    @JsonIgnore
    private Student student;
}
