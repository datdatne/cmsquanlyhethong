package com.example.cms_quanlyhethong.dto.request.student;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserUpdateRequest {
    private String fullname;
    private Date dateofbirth;
    private String email;
    private String phone;
    private String address;
    private String major;
    private String classname;
}
