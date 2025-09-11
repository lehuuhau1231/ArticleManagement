package com.lhh.article.service;

import com.lhh.article.entity.User;
import com.lhh.article.enums.Role;
import com.lhh.article.exception.AppException;
import com.lhh.article.exception.ErrorCode;
import com.lhh.article.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserDetailCustomService implements UserDetailsService {
    UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);

        if(user == null){
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        
        if(!user.getRole().equals(Role.ADMIN)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();
    }
}
