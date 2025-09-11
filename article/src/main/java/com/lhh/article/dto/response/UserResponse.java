package com.lhh.article.dto.response;

import com.lhh.article.enums.Role;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {
    private Role role;
    private String fullName;
}
