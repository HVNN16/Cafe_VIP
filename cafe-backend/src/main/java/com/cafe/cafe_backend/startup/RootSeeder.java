package com.cafe.cafe_backend.startup;

import com.cafe.cafe_backend.model.User;
import com.cafe.cafe_backend.repo.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class RootSeeder implements CommandLineRunner {

    private final UserRepository repo;
    private final PasswordEncoder encoder;

    public RootSeeder(UserRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        if (!repo.existsByUsername("root")) {
            User root = new User("root", "root@cafe.com", encoder.encode("123456"), "ADMIN");
            repo.save(root);
            System.out.println("✅ Đã tạo tài khoản root mặc định: username=root / password=123456");
        }
    }
}
