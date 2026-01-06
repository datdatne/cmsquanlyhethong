package com.example.cms_quanlyhethong.dto.reponse.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
@Data // tu tao getter setter
@AllArgsConstructor
@NoArgsConstructor
public class UserListReponse {
    private Long id;
    private String username;
    private String email;
    private String fullname;
    private boolean isActive;
    private Date createdAt;
    private Date updatedAt;
}
