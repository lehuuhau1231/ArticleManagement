package com.lhh.article.service;

import com.lhh.article.dto.request.UserRequest;
import com.lhh.article.dto.response.UserResponse;
import com.lhh.article.entity.User;
import com.lhh.article.enums.Role;
import com.lhh.article.exception.AppException;
import com.lhh.article.exception.ErrorCode;
import com.lhh.article.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;

    public void createUser(UserRequest request) {
        if(userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTS);
        }

        String passwordEncode = passwordEncoder.encode(request.getPassword());

        User user = User.builder()
                .email(request.getEmail())
                .fullName(request.getFullName())
                .password(passwordEncode)
                .role(Role.USER)
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);
    }

    public UserResponse getUser() {
        String email = (String) org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email);

        if(user == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        return UserResponse.builder()
                .fullName(user.getFullName())
                .role(user.getRole())
                .build();
    }
}
