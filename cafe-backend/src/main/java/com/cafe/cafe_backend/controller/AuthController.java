package com.cafe.cafe_backend.controller;

import com.cafe.cafe_backend.dto.AuthDtos.*;
import com.cafe.cafe_backend.model.User;
import com.cafe.cafe_backend.repo.UserRepository;
import com.cafe.cafe_backend.service.JwtService;
import com.cafe.cafe_backend.service.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository repo;
    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authManager;

    public AuthController(UserRepository repo, UserService userService,
                          JwtService jwtService, AuthenticationManager authManager) {
        this.repo = repo;
        this.userService = userService;
        this.jwtService = jwtService;
        this.authManager = authManager;
    }

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest req) {
        if (repo.existsByUsername(req.username))
            throw new RuntimeException("Username đã tồn tại");
        if (repo.existsByEmail(req.email))
            throw new RuntimeException("Email đã tồn tại");
        return userService.createUser(req.username, req.email, req.password, "USER");
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest req) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.username, req.password));
        UserDetails user = (UserDetails) auth.getPrincipal();
        User u = repo.findByUsername(user.getUsername()).orElseThrow();
        String token = jwtService.generate(u.getUsername(), Map.of("role", u.getRole()));
        return new AuthResponse(token, u.getUsername(), u.getRole());
    }
}
