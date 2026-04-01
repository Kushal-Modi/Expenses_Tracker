package com.expensetracker.controller;

import com.expensetracker.dto.PasswordChangeDto;
import com.expensetracker.dto.UserProfileDto;
import com.expensetracker.model.User;
import com.expensetracker.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.PUT, RequestMethod.OPTIONS})
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDto> getProfile() {
        User user = getCurrentUser();
        return ResponseEntity.ok(UserProfileDto.builder()
                .name(user.getName())
                .email(user.getEmail())
                .build());
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileDto> updateProfile(@RequestBody @Valid UserProfileDto profileDto) {
        User user = getCurrentUser();
        user.setName(profileDto.getName());
        user.setEmail(profileDto.getEmail());
        userRepository.save(user);

        return ResponseEntity.ok(UserProfileDto.builder()
                .name(user.getName())
                .email(user.getEmail())
                .build());
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@RequestBody @Valid PasswordChangeDto passwordDto) {
        User user = getCurrentUser();
        
        if (!passwordEncoder.matches(passwordDto.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Current password is incorrect");
        }
        
        user.setPassword(passwordEncoder.encode(passwordDto.getNewPassword()));
        userRepository.save(user);
        
        return ResponseEntity.ok().build();
    }
}
