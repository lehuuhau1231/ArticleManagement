package com.lhh.article.service;

import com.lhh.article.dto.request.AuthenticationRequest;
import com.lhh.article.dto.response.AuthenticationResponse;
import com.lhh.article.entity.User;
import com.lhh.article.exception.AppException;
import com.lhh.article.exception.ErrorCode;
import com.lhh.article.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {
    PasswordEncoder passwordEncoder;
    JwtService jwtService;
    UserRepository userRepository;


    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        User user = userRepository.findByEmail(request.getEmail());
        if (user == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if (authenticated) {
            var token = jwtService.generateToken(user);

            return AuthenticationResponse.builder()
                    .token(token)
                    .role(user.getRole().toString())
                    .fullName(user.getFullName())
                    .build();
        } else {
            throw new AppException(ErrorCode.WRONG_PASSWORD);
        }
    }
}
