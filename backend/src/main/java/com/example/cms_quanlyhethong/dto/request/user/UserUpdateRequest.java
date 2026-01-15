package com.example.cms_quanlyhethong.dto.request.user;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateRequest {

    private String username;

    private String password;  // Nullable - chỉ update khi cần

    private String email;

    private String fullname;

    private Boolean isActive;  // Nullable

    private Set<Long> roleIds;  // Nullable - chỉ update khi cần
}