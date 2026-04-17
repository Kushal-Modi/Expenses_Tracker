package com.expensetracker.controller;

import com.expensetracker.dto.AuthRequest;
import com.expensetracker.dto.AuthResponse;
import com.expensetracker.dto.RegisterRequest;
import com.expensetracker.model.Role;
import com.expensetracker.model.User;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.AuthenticationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {

        System.out.println("🔥 HIT REGISTER API");
        System.out.println("USERNAME: " + request.getUsername());

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            System.out.println("❌ USER EXISTS");
            return ResponseEntity.badRequest().build();
        }

        var user = User.builder()
                .username(request.getUsername())
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        userRepository.save(user);

        System.out.println("✅ USER SAVED");

        var jwtToken = jwtUtil.generateToken(user);

        return ResponseEntity.ok(AuthResponse.builder().token(jwtToken).build());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            System.out.println("🔐 LOGIN ATTEMPT FOR: " + request.getUsername());
            
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );

            var user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow();

            var jwtToken = jwtUtil.generateToken(user);
            System.out.println("✅ LOGIN SUCCESSFUL");

            return ResponseEntity.ok(AuthResponse.builder().token(jwtToken).build());
        } catch (AuthenticationException e) {
            System.out.println("❌ LOGIN FAILED: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        } catch (Exception e) {
            System.out.println("💥 UNEXPECTED ERROR DURING LOGIN: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }
}
