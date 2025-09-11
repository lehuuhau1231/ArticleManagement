package com.lhh.article.controller;

import com.lhh.article.dto.request.UserRequest;
import com.lhh.article.dto.response.ApiResponse;
import com.lhh.article.dto.response.UserResponse;
import com.lhh.article.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
    UserService userService;

    @PostMapping
    public ResponseEntity<Map<String, String>> createUser(@Valid @RequestBody UserRequest request) {
        userService.createUser(request);
        return ResponseEntity.ok(Map.of("message", "User created successfully"));
    }

    @GetMapping
    public ResponseEntity<UserResponse> getUser() {
        return ResponseEntity.ok(userService.getUser());
    }
}
