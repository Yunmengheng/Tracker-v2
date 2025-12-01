package com.financialtracker.auth.service;

import com.financialtracker.auth.dto.*;
import com.financialtracker.auth.model.User;
import com.financialtracker.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setCurrency(request.getCurrency());
        user.setTheme("light");
        user.setNotificationsEnabled(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        user = userRepository.save(user);

        String token = jwtService.generateToken(user.getId(), user.getEmail());
        UserDTO userDTO = mapToDTO(user);

        return new AuthResponse(token, userDTO);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtService.generateToken(user.getId(), user.getEmail());
        UserDTO userDTO = mapToDTO(user);

        return new AuthResponse(token, userDTO);
    }

    public UserDTO getProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToDTO(user);
    }

    public UserDTO updateProfile(String userId, UserDTO updates) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updates.getName() != null) user.setName(updates.getName());
        if (updates.getCurrency() != null) user.setCurrency(updates.getCurrency());
        if (updates.getTheme() != null) user.setTheme(updates.getTheme());
        user.setNotificationsEnabled(updates.isNotificationsEnabled());
        user.setUpdatedAt(LocalDateTime.now());

        user = userRepository.save(user);
        return mapToDTO(user);
    }

    private UserDTO mapToDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getCurrency(),
                user.getTheme(),
                user.isNotificationsEnabled()
        );
    }
}
